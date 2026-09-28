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
  Code2,
  X,
  ShieldCheck
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
  { label: 'API Reference', href: '/app/api-docs', icon: Code2 },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { alerts, isMobileMenuOpen, setIsMobileMenuOpen } = useSentinel();
  const unacknowledgedCount = alerts.filter(a => !a.acknowledged).length;

  const NavContent = (
    <div className="flex flex-col justify-between h-full py-5 select-none">
      {/* Primary Navigation List */}
      <div className="space-y-1 px-3.5">
        <div className="flex items-center justify-between px-3 py-2 mb-1">
          <span className="text-xs font-mono uppercase tracking-wider text-apple-muted dark:text-eco-400 font-semibold">
            Platform Workspace
          </span>
          {/* Close button for mobile drawer */}
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden p-1 rounded-lg text-apple-muted hover:text-apple-text dark:hover:text-eco-100"
            aria-label="Close menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition-all ${
                isActive
                  ? 'bg-env-emerald/10 dark:bg-eco-800 text-env-emerald dark:text-eco-50 font-semibold shadow-apple-sm border border-env-emerald/20 dark:border-eco-700'
                  : 'text-apple-secondary dark:text-eco-300 hover:text-apple-text dark:hover:text-eco-100 hover:bg-apple-subtle dark:hover:bg-eco-850 font-medium'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-env-emerald dark:text-eco-50' : 'text-apple-muted dark:text-eco-400'}`} />
                <span className="text-sm font-medium">{item.label}</span>
              </div>

              {item.hasBadge && unacknowledgedCount > 0 && (
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-status-critical-subtle text-status-critical border border-status-critical-border">
                  {unacknowledgedCount}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* System Telemetry Metadata Footer */}
      <div className="px-5 pt-4 border-t border-apple-border dark:border-eco-750 text-xs text-apple-muted dark:text-eco-400 space-y-2">
        <div className="flex justify-between items-center text-apple-secondary dark:text-eco-200">
          <div className="flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-env-emerald" />
            <span>Telemetry Health</span>
          </div>
          <span className="text-env-emerald font-mono font-semibold">99.98%</span>
        </div>
        <div className="flex justify-between items-center text-apple-muted dark:text-eco-300">
          <span>Engine Version</span>
          <span className="font-mono text-xs">v2.4-enterprise</span>
        </div>
        <div className="pt-2 text-[11px] text-apple-muted/80 dark:text-eco-400/80 leading-relaxed">
          ISO 14064 / GHG Protocol Aligned
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-apple-border dark:border-eco-700 bg-white dark:bg-eco-950 shrink-0 h-[calc(100vh-4rem)] transition-colors">
        {NavContent}
      </aside>

      {/* Mobile Drawer (Visible when isMobileMenuOpen is true) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop Blur Overlay */}
          <div 
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            aria-hidden="true"
          />

          {/* Drawer Content */}
          <div className="relative w-72 max-w-[85vw] bg-white dark:bg-eco-950 border-r border-apple-border dark:border-eco-700 h-full shadow-2xl flex flex-col z-10 transition-transform">
            {NavContent}
          </div>
        </div>
      )}
    </>
  );
}
