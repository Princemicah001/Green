'use client';

import React, { useState } from 'react';
import { useSentinel } from '@/lib/store/sentinelStore';
import { GiftItem } from '@/types';
import {
  Coins, Gift, Lamp, House, BatteryCharging, Droplets, Filter, Flame, Sprout, Cylinder,
  ShoppingCart, CheckCircle2, Trophy, Info, Truck, PartyPopper
} from 'lucide-react';

const GIFT_ICONS: Record<string, React.ElementType> = {
  lamp: Lamp,
  'home-solar': House,
  battery: BatteryCharging,
  pump: Droplets,
  droplets: Droplets,
  filter: Filter,
  flame: Flame,
  sprout: Sprout,
  tank: Cylinder,
};

const CATEGORY_TABS = [
  { id: 'ALL', label: 'Everything' },
  { id: 'SOLAR', label: 'Solar' },
  { id: 'LIGHTING', label: 'Lighting' },
  { id: 'WATER', label: 'Water' },
  { id: 'COOKING', label: 'Cooking' },
  { id: 'HOUSEHOLD', label: 'Community' },
] as const;

export default function GreenRewardsMarketplace() {
  const { giftCatalog, pointsWallet, redeemGift } = useSentinel();
  const [category, setCategory] = useState<string>('ALL');
  const [affordableOnly, setAffordableOnly] = useState(false);
  const [redeemTarget, setRedeemTarget] = useState<GiftItem | null>(null);
  const [justRedeemed, setJustRedeemed] = useState<{ gift: GiftItem; code: string } | null>(null);

  const items = giftCatalog
    .filter(g => category === 'ALL' || g.category === category)
    .filter(g => !affordableOnly || g.costPoints <= pointsWallet.balance)
    .sort((a, b) => a.costPoints - b.costPoints);

  const handleConfirm = () => {
    if (!redeemTarget) return;
    const ok = redeemGift(redeemTarget);
    if (ok) {
      setJustRedeemed({
        gift: redeemTarget,
        code: `GR-${redeemTarget.id.toUpperCase().slice(0, 4)}-${Math.floor(1000 + Math.random() * 9000)}`,
      });
    }
    setRedeemTarget(null);
  };

  return (
    <div className="space-y-6">
      {/* Wallet Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-env-forest via-env-emerald to-env-leaf p-6 sm:p-8 text-white shadow-apple-card">
        <div className="absolute -right-8 -top-8 w-48 h-48 rounded-full bg-white/10" />
        <div className="absolute -right-16 bottom-0 w-64 h-64 rounded-full bg-white/5" />
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-white/80 font-semibold">
              <Coins className="w-4 h-4" /> Your GreenPoints wallet
            </div>
            <div className="text-5xl sm:text-6xl font-bold font-mono mt-2">{pointsWallet.balance}</div>
            <div className="text-sm text-white/80 mt-1">points ready to spend</div>
          </div>            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-3.5 bg-white/10 backdrop-blur rounded-2xl">
                <div className="text-white/70 text-xs font-medium">Lifetime earned</div>
                <div className="text-2xl font-bold font-mono">{pointsWallet.totalEarned}</div>
              </div>
              <div className="p-3.5 bg-white/10 backdrop-blur rounded-2xl">
                <div className="text-white/70 text-xs font-medium">Lifetime redeemed</div>
                <div className="text-2xl font-bold font-mono">{pointsWallet.totalRedeemed}</div>
              </div>
            </div>
          <div className="p-4 bg-white/10 backdrop-blur rounded-2xl text-sm leading-relaxed">
            <div className="flex items-center gap-2 font-bold mb-1">
              <Trophy className="w-4 h-4" /> Earn more
            </div>
            Verified reports earn 50–250 points based on urgency and proof quality.
          </div>
        </div>
        {pointsWallet.history.length > 0 && (
          <div className="relative mt-5 pt-4 border-t border-white/20 flex flex-wrap gap-x-6 gap-y-1 text-xs text-white/80">
            {pointsWallet.history.slice(0, 3).map(t => (
              <span key={t.id}>
                {t.type === 'EARNED' ? '+' : '−'}{t.amount} · {t.description}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {CATEGORY_TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setCategory(t.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
              category === t.id
                ? 'bg-apple-text text-white dark:bg-eco-50 dark:text-eco-950 font-semibold shadow-apple-sm'
                : 'bg-white dark:bg-eco-900 text-apple-secondary dark:text-eco-300 border border-apple-border dark:border-eco-700/80 hover:bg-apple-subtle dark:hover:bg-eco-850'
            }`}
          >
            {t.label}
          </button>
        ))}
        <button
          onClick={() => setAffordableOnly(!affordableOnly)}
          className={`ml-auto px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all border ${
            affordableOnly
              ? 'bg-env-emerald/10 text-env-emerald border-env-emerald/30 font-semibold'
              : 'bg-white dark:bg-eco-900 text-apple-secondary dark:text-eco-300 border-apple-border dark:border-eco-700/80'
          }`}
        >
          Affordable now
        </button>
      </div>

      {/* Catalog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {items.map(gift => {
          const Icon = GIFT_ICONS[gift.icon] || Gift;
          const affordable = pointsWallet.balance >= gift.costPoints;
          const progress = Math.min(100, Math.round((pointsWallet.balance / gift.costPoints) * 100));
          return (
            <div key={gift.id} className="flex flex-col bg-white dark:bg-eco-900 border border-apple-border dark:border-eco-700/80 rounded-2xl shadow-apple-card overflow-hidden hover-card-lift">
              {/* Visual header */}
              <div className="h-28 bg-gradient-to-br from-env-emerald/15 via-env-sky/10 to-env-amber/10 flex items-center justify-center relative">
                <Icon className="w-12 h-12 text-env-emerald" />
                <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/90 dark:bg-eco-950/90 text-[11px] font-mono font-bold text-env-emerald border border-env-emerald/30">
                  {gift.costPoints} pts
                </span>
                {!affordable && (
                  <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded-full bg-black/60 text-white text-[10px] font-semibold">
                    {gift.costPoints - pointsWallet.balance} pts to go
                  </span>
                )}
                {gift.stock <= 5 && (
                  <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded-full bg-status-watch/90 text-white text-[10px] font-bold">
                    only {gift.stock} left
                  </span>
                )}
              </div>

              <div className="p-5 flex-1 flex flex-col gap-2.5">
                <div className="font-bold text-apple-text dark:text-eco-50">{gift.name}</div>
                <p className="text-xs text-apple-secondary dark:text-eco-300 leading-relaxed flex-1">{gift.description}</p>

                {/* Earn progress bar */}
                <div>
                  <div className="h-1.5 bg-apple-subtle dark:bg-eco-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${affordable ? 'bg-env-emerald' : 'bg-env-amber'}`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-apple-muted dark:text-eco-400 mt-1">
                    {affordable ? 'You can get this now' : `${progress}% of the way`}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-apple-muted dark:text-eco-400 font-medium">via {gift.partner}</span>
                  <button
                    onClick={() => setRedeemTarget(gift)}
                    disabled={!affordable}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      affordable
                        ? 'bg-env-emerald hover:bg-env-forest text-white shadow-apple-sm active:scale-95'
                        : 'bg-apple-subtle dark:bg-eco-800 text-apple-muted dark:text-eco-400 cursor-not-allowed'
                    }`}
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    {affordable ? 'Redeem' : 'Locked'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* How earning works */}
      <div className="p-5 bg-white dark:bg-eco-900 border border-apple-border dark:border-eco-700/80 rounded-2xl shadow-apple-card flex items-start gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-env-emerald/10 border border-env-emerald/20 flex items-center justify-center text-env-emerald shrink-0">
          <Info className="w-5 h-5" />
        </div>
        <div className="text-xs sm:text-sm text-apple-secondary dark:text-eco-300 leading-relaxed">
          <strong className="text-apple-text dark:text-eco-100">How to earn GreenPoints:</strong> every report verified as true earns points
          (more for urgent problems and strong evidence). When your report is verified you get a ticket number —
          dial <span className="font-mono font-bold text-env-emerald">*384*EC#</span>, enter it, and the points land in this wallet. Points never expire.
        </div>
      </div>

      {/* Redeem Confirmation Modal */}
      {redeemTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
          <div className="w-full max-w-sm bg-white dark:bg-eco-900 border border-apple-border dark:border-eco-700 rounded-3xl shadow-apple-hover p-6 text-apple-text dark:text-eco-50">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-2xl bg-env-emerald/10 flex items-center justify-center text-env-emerald">
                <Gift className="w-6 h-6" />
              </div>
              <div>
                <div className="font-bold">Redeem this reward?</div>
                <div className="text-xs text-apple-secondary dark:text-eco-300">{redeemTarget.name}</div>
              </div>
            </div>
            <div className="p-3.5 bg-apple-subtle dark:bg-eco-850 rounded-xl text-sm space-y-1.5 mb-4">
              <div className="flex justify-between"><span className="text-apple-muted">Cost</span><span className="font-bold font-mono">{redeemTarget.costPoints} pts</span></div>
              <div className="flex justify-between"><span className="text-apple-muted">Your balance after</span><span className="font-bold font-mono">{pointsWallet.balance - redeemTarget.costPoints} pts</span></div>
            </div>
            <div className="flex gap-2.5">
              <button onClick={() => setRedeemTarget(null)} className="flex-1 py-2.5 bg-apple-subtle dark:bg-eco-800 rounded-xl text-sm font-semibold text-apple-secondary dark:text-eco-300 hover:bg-apple-hover dark:hover:bg-eco-750 transition-colors">
                Not now
              </button>
              <button onClick={handleConfirm} className="flex-1 py-2.5 bg-env-emerald hover:bg-env-forest text-white rounded-xl text-sm font-bold transition-all shadow-apple-sm">
                Yes, redeem
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {justRedeemed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
          <div className="w-full max-w-sm bg-white dark:bg-eco-900 border border-apple-border dark:border-eco-700 rounded-3xl shadow-apple-hover p-7 text-center text-apple-text dark:text-eco-50 space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-env-emerald/10 flex items-center justify-center text-env-emerald">
              <PartyPopper className="w-8 h-8" />
            </div>
            <div className="text-xl font-bold">Enjoy your {justRedeemed.gift.name}!</div>
            <div className="p-4 bg-apple-subtle dark:bg-eco-850 rounded-2xl">
              <div className="text-xs text-apple-muted dark:text-eco-400 font-mono uppercase font-semibold mb-1">Pickup voucher</div>
              <div className="text-lg font-mono font-bold text-env-emerald">{justRedeemed.code}</div>
            </div>
            <p className="text-xs text-apple-secondary dark:text-eco-300 leading-relaxed flex items-center gap-2 justify-center">
              <Truck className="w-4 h-4 text-env-emerald shrink-0" />
              Show this code at the pickup point. Delivery available for larger items.
            </p>
            <button onClick={() => setJustRedeemed(null)} className="w-full py-3 bg-env-emerald hover:bg-env-forest text-white rounded-2xl font-semibold transition-all">
              Great, done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
