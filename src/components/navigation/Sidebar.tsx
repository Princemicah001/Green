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
    <aside className="w-64 border-r border-eco-700 bg-eco-950 flex flex-col justify-between py-5 select-none shrink-0 h-[calc(100vh-4rem)]">
      {/* Primary Navigation List */}
      <div className="space-y-1.5 px-3.5">
        <div className="text-xs font-mono uppercase tracking-widest text-eco-400 px-3 py-1.5 mb-1 font-semibold">
          Platform Workspace
        </div>

        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2.5 rounded text-sm transition-colors ${
                isActive
                  ? 'bg-eco-800 text-eco-50 font-semibold border border-eco-700'
                  : 'text-eco-300 hover:text-eco-100 hover:bg-eco-850 font-medium'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-eco-50' : 'text-eco-400'}`} />
                <span>{item.label}</span>
              </div>

              {item.hasBadge && unacknowledgedCount > 0 && (
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-status-critical-subtle text-status-critical-text border border-status-critical-border">
                  {unacknowledgedCount}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* System Telemetry Metadata Footer */}
      <div className="px-5 pt-4 border-t border-eco-750 text-xs font-mono text-eco-400 space-y-1.5">
        <div className="flex justify-between items-center text-eco-200">
          <span>Engine Status</span>
          <span className="text-status-healthy font-semibold">99.98%</span>
        </div>
        <div className="flex justify-between items-center text-eco-300">
          <span>Version</span>
          <span>v2.4-enterprise</span>
        </div>
        <div className="pt-2 text-[11px] text-eco-400">
          ISO 14064 / GHG Protocol Aligned
        </div>
      </div>
    </aside>
  );
}
