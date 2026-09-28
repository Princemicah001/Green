'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSentinel } from '@/lib/store/sentinelStore';
import {
  LayoutDashboard, Globe2, Users, Building2, CloudRain, History,
  AlertTriangle, Coins, Code2, Megaphone, Smartphone, Gift, Radar,
  Menu, X, Sun, Moon, Bell, ChevronDown, Home
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Overview', href: '/app', icon: LayoutDashboard },
  { label: 'Sentinel Globe', href: '/app/globe', icon: Globe2 },
  { label: 'Community', href: '/app/community', icon: Users },
  { label: 'Claims', href: '/app/claims', icon: Megaphone },
  { label: 'Rewards', href: '/app/rewards', icon: Gift },
  { label: 'Green Line', href: '/app/ussd', icon: Smartphone },
  { label: 'Infrastructure', href: '/app/infrastructure', icon: Building2 },
  { label: 'Climate', href: '/app/climate', icon: CloudRain },
  { label: 'History', href: '/app/history', icon: History },
  { label: 'Alerts', href: '/app/alerts', icon: AlertTriangle, hasBadge: true },
  { label: 'Controller', href: '/app/controller', icon: Radar },
  { label: 'API Reference', href: '/app/api-docs', icon: Code2 },
];

/** Show first N items directly; tuck the rest into a "More" dropdown on desktop */
const DESKTOP_PRIMARY_COUNT = 8;

export default function TopNav() {
  const pathname = usePathname();
  const {
    alerts, theme, toggleTheme, isMobileMenuOpen, setIsMobileMenuOpen,
    setIsClaimModalOpen, pointsWallet,
  } = useSentinel();

  const [moreOpen, setMoreOpen] = useState(false);
  const unacknowledgedCount = alerts.filter(a => !a.acknowledged).length;

  const primary = NAV_ITEMS.slice(0, DESKTOP_PRIMARY_COUNT);
  const overflow = NAV_ITEMS.slice(DESKTOP_PRIMARY_COUNT);

  const isActive = (href: string) => pathname === href;

  const linkCls = (active: boolean) =>
    `flex items-center gap-1.5 px-3 py-2 rounded-xl text-[13px] font-medium whitespace-nowrap transition-all ${
      active
        ? 'bg-env-emerald/10 text-env-emerald dark:bg-eco-800 dark:text-eco-50 font-semibold shadow-apple-sm'
        : 'text-apple-secondary dark:text-eco-300 hover:text-apple-text dark:hover:text-eco-100 hover:bg-apple-subtle dark:hover:bg-eco-850'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-eco-950/95 backdrop-blur-xl border-b border-apple-border dark:border-eco-700 shadow-apple-sm">
      {/* Row 1: brand + actions */}
      <div className="h-16 px-4 sm:px-6 flex items-center justify-between gap-3">
        {/* Brand + mobile hamburger */}
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-apple-secondary dark:text-eco-300 hover:bg-apple-subtle dark:hover:bg-eco-850 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link href="/app" className="flex items-center gap-2.5 group min-w-0">
            <div className="w-9 h-9 rounded-xl bg-env-emerald/10 dark:bg-env-emerald/20 border border-env-emerald/30 flex items-center justify-center text-env-emerald group-hover:scale-105 transition-all shrink-0">
              <span className="text-base font-mono font-bold leading-none">E</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-base font-bold tracking-tight text-apple-text dark:text-eco-50 uppercase font-sans leading-tight">Eco-Shield</span>
              <span className="text-[10px] font-mono text-apple-muted dark:text-eco-400 tracking-wide hidden sm:block">Open Environmental Watch</span>
            </div>
          </Link>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Points pill */}
          <Link
            href="/app/rewards"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-env-emerald/10 border border-env-emerald/25 text-env-emerald text-xs font-bold hover:bg-env-emerald/20 transition-all"
            title="Your GreenPoints"
          >
            <Gift className="w-3.5 h-3.5" />
            {pointsWallet.balance} pts
          </Link>

          {/* Report CTA */}
          <button
            onClick={() => setIsClaimModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-env-emerald hover:bg-env-forest text-white rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-apple-sm active:scale-95"
          >
            <Megaphone className="w-4 h-4" />
            <span className="hidden sm:inline">Report</span>
          </button>

          {/* Theme */}
          <button
            onClick={toggleTheme}
            className="p-2 text-apple-secondary dark:text-eco-300 hover:text-apple-text dark:hover:text-eco-100 bg-apple-subtle dark:bg-eco-900 border border-apple-border dark:border-eco-700 rounded-xl transition-all"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>

          {/* Alerts */}
          <Link
            href="/app/alerts"
            className="relative p-2 text-apple-secondary dark:text-eco-300 hover:text-apple-text dark:hover:text-eco-50 bg-apple-subtle dark:bg-eco-900 border border-apple-border dark:border-eco-700 rounded-xl transition-all"
            title="Alerts"
          >
            <Bell className="w-4 h-4" />
            {unacknowledgedCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-status-critical text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                {unacknowledgedCount}
              </span>
            )}
          </Link>

          {/* Public site */}
          <Link
            href="/"
            className="hidden md:flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-apple-secondary dark:text-eco-300 hover:text-env-emerald rounded-xl border border-apple-border dark:border-eco-700 bg-apple-subtle dark:bg-eco-900 transition-colors"
          >
            <Home className="w-3.5 h-3.5" /> Public site
          </Link>
        </div>
      </div>

      {/* Row 2: desktop nav strip */}
      <div className="hidden lg:flex items-center gap-1 px-4 sm:px-6 pb-2 overflow-x-auto">
        {primary.map(item => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className={linkCls(isActive(item.href))}>
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
              {item.hasBadge && unacknowledgedCount > 0 && (
                <span className="ml-0.5 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-status-critical text-white">
                  {unacknowledgedCount}
                </span>
              )}
            </Link>
          );
        })}

        {/* More dropdown */}
        <div className="relative">
          <button
            onClick={() => setMoreOpen(!moreOpen)}
            onBlur={() => setTimeout(() => setMoreOpen(false), 150)}
            className={linkCls(overflow.some(i => isActive(i.href)))}
          >
            <span>More</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${moreOpen ? 'rotate-180' : ''}`} />
          </button>
          {moreOpen && (
            <div className="absolute left-0 top-full mt-1 w-52 bg-white dark:bg-eco-900 border border-apple-border dark:border-eco-700 rounded-2xl shadow-apple-hover py-2 z-50">
              {overflow.map(item => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors ${
                      isActive(item.href)
                        ? 'bg-env-emerald/10 text-env-emerald font-semibold'
                        : 'text-apple-secondary dark:text-eco-300 hover:bg-apple-subtle dark:hover:bg-eco-850'
                    }`}
                  >
                    <Icon className="w-4 h-4" /> {item.label}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Mobile drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            aria-hidden="true"
          />
          <div className="relative w-72 max-w-[85vw] bg-white dark:bg-eco-950 border-r border-apple-border dark:border-eco-700 h-full shadow-2xl flex flex-col z-10">
            <div className="flex items-center justify-between px-5 py-4 border-b border-apple-border dark:border-eco-750">
              <span className="text-xs font-mono uppercase tracking-wider text-apple-muted dark:text-eco-400 font-semibold">
                Menu
              </span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-apple-muted hover:text-apple-text dark:hover:text-eco-100"
                aria-label="Close menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
              {NAV_ITEMS.map(item => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition-all ${
                      isActive(item.href)
                        ? 'bg-env-emerald/10 dark:bg-eco-800 text-env-emerald dark:text-eco-50 font-semibold border border-env-emerald/20 dark:border-eco-700'
                        : 'text-apple-secondary dark:text-eco-300 hover:bg-apple-subtle dark:hover:bg-eco-850 font-medium'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Icon className="w-4.5 h-4.5" />
                      {item.label}
                    </span>
                    {item.hasBadge && unacknowledgedCount > 0 && (
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-status-critical-subtle text-status-critical border border-status-critical-border">
                        {unacknowledgedCount}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
            <div className="px-5 py-4 border-t border-apple-border dark:border-eco-750 text-xs text-apple-muted dark:text-eco-400">
              An open community project — everyone can watch, report and earn.
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
