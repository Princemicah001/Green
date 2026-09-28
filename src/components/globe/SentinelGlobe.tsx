'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { LocationTwin, FacilityTelemetry, CommunityReport, EnvironmentalStatus } from '@/types';

interface SentinelGlobeProps {
  locations: LocationTwin[];
  facilities: FacilityTelemetry[];
  communityReports: CommunityReport[];
  selectedLocationId: string;
  onSelectLocation: (id: string) => void;
  showFacilities?: boolean;
  showCommunitySignals?: boolean;
  showClimateStress?: boolean;
  filterStatus?: EnvironmentalStatus | 'ALL';
  className?: string;
  interactive?: boolean;
  autoRotateSpeed?: number;
}

// Coordinate projection from Geographic degrees to Three.js Cartesian coordinates
export function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

function getStatusHexColor(status: EnvironmentalStatus): number {
  switch (status) {
    case 'HEALTHY': return 0x2E8B57;  // Restrained green
    case 'WATCH': return 0xC9822B;    // Muted amber
    case 'STRESSED': return 0xD9532F; // Muted orange
    case 'CRITICAL': return 0xB93838; // Restrained red
    default: return 0x8B9299;
  }
}

export default function SentinelGlobe({
  locations,
  facilities,
  communityReports,
  selectedLocationId,
  onSelectLocation,
  showFacilities = true,
  showCommunitySignals = true,
  showClimateStress = true,
  filterStatus = 'ALL',
  className = '',
  interactive = true,
  autoRotateSpeed = 0.25,
}: SentinelGlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // References for Three.js state across renders
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const earthMeshRef = useRef<THREE.Mesh | null>(null);
  const markersGroupRef = useRef<THREE.Group | null>(null);
  const facilitiesGroupRef = useRef<THREE.Group | null>(null);
  const communityGroupRef = useRef<THREE.Group | null>(null);
  const atmosphereRef = useRef<THREE.Mesh | null>(null);

  const markerMeshesMapRef = useRef<Map<string, THREE.Object3D>>(new Map());
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2());

  // Camera flight interpolation target
  const targetCameraPos = useRef<THREE.Vector3 | null>(null);
  const targetLookAt = useRef<THREE.Vector3 | null>(null);
  const isTransitioningCamera = useRef<boolean>(false);

  // Hover state
  const [hoveredEntity, setHoveredEntity] = useState<{
    name: string;
    type: 'location' | 'facility' | 'community';
    status?: EnvironmentalStatus;
    stress?: number;
    x: number;
    y: number;
  } | null>(null);

  const GLOBE_RADIUS = 2.0;

  // Initialize Three.js scene
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    // Initial camera position overlooking East Africa
    const initialCamPos = latLngToVector3(0, 37.9, GLOBE_RADIUS * 2.8);
    camera.position.copy(initialCamPos);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    rendererRef.current = renderer;

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.6;
    controls.zoomSpeed = 0.8;
    controls.minDistance = GLOBE_RADIUS * 1.25;
    controls.maxDistance = GLOBE_RADIUS * 4.8;
    controls.enablePan = false;
    controls.autoRotate = autoRotateSpeed > 0;
    controls.autoRotateSpeed = autoRotateSpeed;
    controlsRef.current = controls;

    // 5. Lighting
    // Ambient light: restrained, subtle illumination of the dark side
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.42);
    scene.add(ambientLight);

    // Directional light: simulates the Sun
    const sunLight = new THREE.DirectionalLight(0xffffff, 1.25);
    sunLight.position.set(6, 4, 7);
    scene.add(sunLight);

    // Secondary fill light for soft dimensional depth
    const rimLight = new THREE.DirectionalLight(0x426888, 0.35);
    rimLight.position.set(-6, -2, -5);
    scene.add(rimLight);

    // 6. Earth Sphere Geometry & Texture
    const earthGeometry = new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64);
    const textureLoader = new THREE.TextureLoader();

    // Load ultralightweight satellite earth texture (300KB) and topology (27KB) for instant loading
    const dayTexture = textureLoader.load(
      '/textures/earth-day-light.jpg',
      () => { 
        renderer.render(scene, camera); 
      },
      undefined,
      () => {
        console.warn('Satellite earth texture fallback applied.');
      }
    );
    dayTexture.colorSpace = THREE.SRGBColorSpace;
    dayTexture.generateMipmaps = true;
    dayTexture.minFilter = THREE.LinearMipmapLinearFilter;

    const bumpTexture = textureLoader.load('/textures/earth-topology-light.jpg');
    bumpTexture.generateMipmaps = true;

    const earthMaterial = new THREE.MeshStandardMaterial({
      color: 0x121F2D, // Oceanic base color during instant load
      map: dayTexture,
      bumpMap: bumpTexture,
      bumpScale: 0.012,
      roughness: 0.65,
      metalness: 0.05,
    });

    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earthMesh);
    earthMeshRef.current = earthMesh;

    // 7. Subtle Atmosphere Shader Glow
    const atmosphereGeometry = new THREE.SphereGeometry(GLOBE_RADIUS * 1.025, 48, 48);
    const atmosphereMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.2);
          gl_FragColor = vec4(0.28, 0.48, 0.72, 1.0) * intensity * 0.42;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    scene.add(atmosphereMesh);
    atmosphereRef.current = atmosphereMesh;

    // 8. Marker Groups
    const markersGroup = new THREE.Group();
    scene.add(markersGroup);
    markersGroupRef.current = markersGroup;

    const facilitiesGroup = new THREE.Group();
    scene.add(facilitiesGroup);
    facilitiesGroupRef.current = facilitiesGroup;

    const communityGroup = new THREE.Group();
    scene.add(communityGroup);
    communityGroupRef.current = communityGroup;

    // 9. Resize Observer
    const handleResize = () => {
      if (!containerRef.current || !renderer || !camera) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(containerRef.current);

    // 10. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Camera flight interpolation (smooth slerp)
      if (isTransitioningCamera.current && targetCameraPos.current && targetLookAt.current) {
        camera.position.lerp(targetCameraPos.current, 0.05);
        controls.target.lerp(targetLookAt.current, 0.05);
        if (camera.position.distanceTo(targetCameraPos.current) < 0.02) {
          isTransitioningCamera.current = false;
        }
      }

      // Gentle pulsing on critical markers
      if (markersGroupRef.current) {
        markersGroupRef.current.children.forEach(child => {
          const isCritical = child.userData.status === 'CRITICAL';
          const pulseRing = child.getObjectByName('pulseRing');
          if (pulseRing) {
            if (isCritical) {
              const scale = 1.0 + Math.sin(time * 3) * 0.25;
              pulseRing.scale.set(scale, scale, scale);
              (pulseRing as THREE.Mesh).material = (pulseRing as THREE.Mesh).material;
            } else {
              pulseRing.scale.set(1, 1, 1);
            }
          }
        });
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      controls.dispose();
      renderer.dispose();
      dayTexture.dispose();
      bumpTexture.dispose();
      earthGeometry.dispose();
      earthMaterial.dispose();
      atmosphereGeometry.dispose();
      atmosphereMaterial.dispose();
    };
  }, []);

  // Update Geographic Markers when locations or filters change
  useEffect(() => {
    const group = markersGroupRef.current;
    if (!group) return;

    // Clear previous markers
    while (group.children.length > 0) {
      const child = group.children[0];
      group.remove(child);
      if ((child as THREE.Mesh).geometry) (child as THREE.Mesh).geometry.dispose();
    }
    markerMeshesMapRef.current.clear();

    if (!showClimateStress) return;

    locations.forEach(loc => {
      if (filterStatus !== 'ALL' && loc.status !== filterStatus) return;

      const pos = latLngToVector3(loc.latitude, loc.longitude, GLOBE_RADIUS * 1.008);
      const normal = pos.clone().normalize();

      const markerParent = new THREE.Group();
      markerParent.position.copy(pos);
      markerParent.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);

      const colorHex = getStatusHexColor(loc.status);
      const isSelected = loc.id === selectedLocationId;

      // Base Pin: subtle circular disc
      const discGeo = new THREE.CylinderGeometry(0.032, 0.032, 0.008, 24);
      const discMat = new THREE.MeshBasicMaterial({ color: colorHex });
      const discMesh = new THREE.Mesh(discGeo, discMat);
      discMesh.name = 'pinCore';
      markerParent.add(discMesh);

      // Elevated signal point
      const pointGeo = new THREE.SphereGeometry(isSelected ? 0.038 : 0.026, 16, 16);
      const pointMat = new THREE.MeshStandardMaterial({
        color: colorHex,
        emissive: colorHex,
        emissiveIntensity: isSelected ? 0.6 : 0.25,
        roughness: 0.3,
      });
      const pointMesh = new THREE.Mesh(pointGeo, pointMat);
      pointMesh.position.y = 0.025;
      markerParent.add(pointMesh);

      // Subtle outer ring
      const ringGeo = new THREE.RingGeometry(0.045, 0.055, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: colorHex,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: isSelected ? 0.85 : 0.45,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2;
      ringMesh.position.y = 0.005;
      ringMesh.name = 'pulseRing';
      markerParent.add(ringMesh);

      markerParent.userData = {
        type: 'location',
        id: loc.id,
        name: loc.name,
        status: loc.status,
        stress: loc.overallStress,
      };

      group.add(markerParent);
      markerMeshesMapRef.current.set(loc.id, markerParent);
    });
  }, [locations, selectedLocationId, filterStatus, showClimateStress]);

  // Update Facility Markers (◎)
  useEffect(() => {
    const group = facilitiesGroupRef.current;
    if (!group) return;

    while (group.children.length > 0) {
      const child = group.children[0];
      group.remove(child);
      if ((child as THREE.Mesh).geometry) (child as THREE.Mesh).geometry.dispose();
    }

    if (!showFacilities) return;

    facilities.forEach(fac => {
      // Find matching location or compute lat/lng
      const loc = locations.find(l => l.id === fac.locationId);
      if (!loc) return;

      // Slight offset so facility doesn't collide exactly with city center
      const lat = loc.latitude + 0.35;
      const lng = loc.longitude + 0.35;
      const pos = latLngToVector3(lat, lng, GLOBE_RADIUS * 1.008);
      const normal = pos.clone().normalize();

      const facParent = new THREE.Group();
      facParent.position.copy(pos);
      facParent.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);

      // Diamond / Octagon facility marker
      const boxGeo = new THREE.BoxGeometry(0.026, 0.026, 0.026);
      const boxMat = new THREE.MeshStandardMaterial({
        color: 0x64748B, // Clean slate
        metalness: 0.6,
        roughness: 0.2,
      });
      const boxMesh = new THREE.Mesh(boxGeo, boxMat);
      boxMesh.rotation.y = Math.PI / 4;
      boxMesh.position.y = 0.02;
      facParent.add(boxMesh);

      facParent.userData = {
        type: 'facility',
        id: fac.id,
        name: fac.name,
        code: fac.code,
        locationId: fac.locationId,
      };

      group.add(facParent);
    });
  }, [facilities, locations, showFacilities]);

  // Update Community Observation markers
  useEffect(() => {
    const group = communityGroupRef.current;
    if (!group) return;

    while (group.children.length > 0) {
      const child = group.children[0];
      group.remove(child);
      if ((child as THREE.Mesh).geometry) (child as THREE.Mesh).geometry.dispose();
    }

    if (!showCommunitySignals) return;

    communityReports.slice(0, 25).forEach(rep => {
      const pos = latLngToVector3(rep.approximateLat, rep.approximateLng, GLOBE_RADIUS * 1.006);
      const normal = pos.clone().normalize();

      const commParent = new THREE.Group();
      commParent.position.copy(pos);
      commParent.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);

      // Small subtle point
      const ptGeo = new THREE.SphereGeometry(0.014, 8, 8);
      const ptMat = new THREE.MeshBasicMaterial({
        color: rep.severity === 'CRITICAL' ? 0xB93838 : (rep.severity === 'HIGH' ? 0xD9532F : 0x8B9299),
        transparent: true,
        opacity: 0.75,
      });
      const ptMesh = new THREE.Mesh(ptGeo, ptMat);
      ptMesh.position.y = 0.01;
      commParent.add(ptMesh);

      commParent.userData = {
        type: 'community',
        id: rep.id,
        anonymousId: rep.anonymousId,
        category: rep.category,
        severity: rep.severity,
      };

      group.add(commParent);
    });
  }, [communityReports, showCommunitySignals]);

  // Smooth Camera Flight to Selected Location
  useEffect(() => {
    const selectedLoc = locations.find(l => l.id === selectedLocationId);
    if (!selectedLoc || !cameraRef.current || !controlsRef.current) return;

    // Compute target position on sphere directly facing location
    const targetPos = latLngToVector3(
      selectedLoc.latitude,
      selectedLoc.longitude,
      GLOBE_RADIUS * 2.3
    );

    targetCameraPos.current = targetPos;
    targetLookAt.current = new THREE.Vector3(0, 0, 0);
    isTransitioningCamera.current = true;

    // Temporarily pause auto-rotation during focused user inspection
    if (controlsRef.current) {
      controlsRef.current.autoRotate = false;
    }
  }, [selectedLocationId, locations]);

  // Pointer interactions (Raycasting for Selection & Tooltip)
  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !cameraRef.current || !sceneRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);

    const interactiveGroups: THREE.Object3D[] = [];
    if (markersGroupRef.current) interactiveGroups.push(markersGroupRef.current);
    if (facilitiesGroupRef.current) interactiveGroups.push(facilitiesGroupRef.current);

    const intersects = raycasterRef.current.intersectObjects(interactiveGroups, true);

    if (intersects.length > 0) {
      let topObj: THREE.Object3D | null = intersects[0].object;
      while (topObj && !topObj.userData?.id && topObj.parent && topObj.parent !== sceneRef.current) {
        topObj = topObj.parent;
      }

      if (topObj && topObj.userData?.type === 'location') {
        onSelectLocation(topObj.userData.id);
      } else if (topObj && topObj.userData?.type === 'facility') {
        onSelectLocation(topObj.userData.locationId);
      }
    }
  }, [onSelectLocation]);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !cameraRef.current || !sceneRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);

    const interactiveGroups: THREE.Object3D[] = [];
    if (markersGroupRef.current) interactiveGroups.push(markersGroupRef.current);

    const intersects = raycasterRef.current.intersectObjects(interactiveGroups, true);

    if (intersects.length > 0) {
      let topObj: THREE.Object3D | null = intersects[0].object;
      while (topObj && !topObj.userData?.id && topObj.parent && topObj.parent !== sceneRef.current) {
        topObj = topObj.parent;
      }

      if (topObj && topObj.userData?.name) {
        setHoveredEntity({
          name: topObj.userData.name,
          type: topObj.userData.type,
          status: topObj.userData.status,
          stress: topObj.userData.stress,
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
        if (canvasRef.current) canvasRef.current.style.cursor = 'pointer';
        return;
      }
    }

    setHoveredEntity(null);
    if (canvasRef.current) canvasRef.current.style.cursor = 'grab';
  }, []);

  return (
    <div ref={containerRef} className={`relative w-full h-full min-h-[480px] bg-eco-950 overflow-hidden select-none ${className}`}>
      {/* Three.js WebGL Canvas */}
      <canvas
        ref={canvasRef}
        onPointerDown={interactive ? handlePointerDown : undefined}
        onPointerMove={interactive ? handlePointerMove : undefined}
        onPointerLeave={() => setHoveredEntity(null)}
        className="w-full h-full block cursor-grab active:cursor-grabbing outline-none"
      />

      {/* Floating Hover Indicator */}
      {hoveredEntity && (
        <div
          className="absolute z-20 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-3 px-3.5 py-2 bg-eco-900/95 border border-eco-700 backdrop-blur-md rounded shadow-xl text-sm flex flex-col gap-1"
          style={{ left: hoveredEntity.x, top: hoveredEntity.y }}
        >
          <div className="flex items-center gap-2.5">
            <span className="font-bold text-eco-50 text-sm">{hoveredEntity.name}</span>
            {hoveredEntity.status && (
              <span className={`text-xs uppercase font-mono px-2 py-0.5 rounded border font-bold ${
                hoveredEntity.status === 'CRITICAL' ? 'text-status-critical-text border-status-critical-border bg-status-critical-subtle' :
                hoveredEntity.status === 'STRESSED' ? 'text-status-stressed-text border-status-stressed-border bg-status-stressed-subtle' :
                hoveredEntity.status === 'WATCH' ? 'text-status-watch-text border-status-watch-border bg-status-watch-subtle' :
                'text-status-healthy-text border-status-healthy-border bg-status-healthy-subtle'
              }`}>
                {hoveredEntity.status}
              </span>
            )}
          </div>
          {hoveredEntity.stress !== undefined && (
            <div className="text-xs text-eco-300 font-mono font-medium">
              Stress Index: <span className="text-eco-50 font-bold">{hoveredEntity.stress}/100</span>
            </div>
          )}
        </div>
      )}

      {/* Coordinate & Compass Watermark */}
      <div className="absolute bottom-4 left-4 z-10 flex items-center gap-3 text-xs font-mono text-eco-400 pointer-events-none font-medium">
        <span>3D SPATIAL ENGINE</span>
        <span className="text-eco-600">/</span>
        <span>EQUATORIAL PROJECTION</span>
        <span className="text-eco-600">/</span>
        <span className="text-eco-200">INTERACTIVE ORBIT</span>
      </div>
    </div>
  );
}
