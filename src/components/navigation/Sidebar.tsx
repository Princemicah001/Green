'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Globe2, 
  Users, 
  Building2, 
  CloudRain, 
  History, 
  AlertTriangle, 
  Coins, 
  Code2 
} from 'lucide-react';
import { useSentinel } from '@/lib/store/sentinelStore';

const NAV_ITEMS = [
  { label: 'Overview', href: '/app', icon: LayoutDashboard },
  { label: 'Sentinel Globe', href: '/app/globe', icon: Globe2 },
  { label: 'Community', href: '/app/community', icon: Users },
  { label: 'Infrastructure', href: '/app/infrastructure', icon: Building2 },
  { label: 'Climate', href: '/app/climate', icon: CloudRain },
  { label: 'History', href: '/app/history', icon: History },
  { label: 'Alerts', href: '/app/alerts', icon: AlertTriangle, hasBadge: true },
  { label: 'Green Finance', href: '/app/finance', icon: Coins },
  { label: 'API', href: '/app/api-docs', icon: Code2 },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { alerts } = useSentinel();
  const unacknowledgedCount = alerts.filter(a => !a.acknowledged).length;

  return (
    <aside className="w-56 border-r border-eco-700 bg-eco-950 flex flex-col justify-between py-4 select-none shrink-0 h-[calc(100vh-3.5rem)]">
      {/* Primary Navigation List */}
      <div className="space-y-1 px-3">
        <div className="text-[10px] font-mono uppercase tracking-widest text-eco-400 px-2.5 py-1 mb-1">
          Workspace
        </div>

        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-2.5 py-2 rounded text-xs transition-colors ${
                isActive
                  ? 'bg-eco-800 text-eco-50 font-medium border border-eco-700'
                  : 'text-eco-300 hover:text-eco-100 hover:bg-eco-850'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-eco-50' : 'text-eco-400'}`} />
                <span>{item.label}</span>
              </div>

              {item.hasBadge && unacknowledgedCount > 0 && (
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-status-critical-subtle text-status-critical-text border border-status-critical-border">
                  {unacknowledgedCount}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* System Telemetry Metadata Footer */}
      <div className="px-5 pt-3 border-t border-eco-750 text-[11px] font-mono text-eco-400 space-y-1">
        <div className="flex justify-between items-center text-eco-300">
          <span>Engine Status</span>
          <span className="text-status-healthy font-medium">99.98%</span>
        </div>
        <div className="flex justify-between items-center text-[10px] text-eco-400">
          <span>Version</span>
          <span>v2.4-enterprise</span>
        </div>
        <div className="pt-2 text-[9px] text-eco-400">
          ISO 14064 / GHG Protocol Aligned
        </div>
      </div>
    </aside>
  );
}
