'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Crown, Check, Star, Zap, Shield, Sparkles, Heart, ArrowRight } from 'lucide-react';
import { CREATOR_PLANS, MEMBER_PLANS, getAnnualSavings } from '@/app/lib/monetization';
import { startSubscriptionCheckout } from '@/app/lib/profileApi';

const ICONS = {
  free: Star,
  community: Heart,
  creator: Zap,
  'all-access': Crown
} as const;

const DISPLAY_PLANS = [
  MEMBER_PLANS.find((plan) => plan.id === 'free')!,
  MEMBER_PLANS.find((plan) => plan.id === 'community')!,
  CREATOR_PLANS.find((plan) => plan.id === 'creator')!,
  MEMBER_PLANS.find((plan) => plan.id === 'all-access')!
];

export default function MembershipCTA() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [workingPlanId, setWorkingPlanId] = useState('');
  const [message, setMessage] = useState('');

  const cards = useMemo(
    () =>
      DISPLAY_PLANS.map((plan) => {
        const Icon = ICONS[plan.id as keyof typeof ICONS] ?? Sparkles;
        const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;
        const savings = getAnnualSavings(plan.monthlyPrice, plan.annualPrice);
        return { plan, Icon, price, savings };
      }),
    [isAnnual]
  );

  async function handlePlanSelect(planId: string) {
    setWorkingPlanId(planId);
    setMessage('');
    const family = planId === 'creator' ? 'creator' : 'member';
    const result = await startSubscriptionCheckout({
      family,
      planId,
      billingCadence: isAnnual ? 'annual' : 'monthly',
      paymentMethod: 'card'
    }).catch((error) => {
      setMessage(error instanceof Error ? error.message : 'Subscription checkout failed.');
      return null;
    });
    setWorkingPlanId('');
    if (!result) return;
    if (result.mode === 'redirect') {
      window.location.href = result.checkoutUrl;
      return;
    }
    setMessage('Plan activated. Billing details are available in the subscription hub.');
  }

  return (
    <section className="bg-gradient-to-b from-[#141414] to-[#0a0a0a] px-6 py-[72px]">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#d4af37]/10 px-4 py-2">
            <Sparkles size={16} className="text-[#d4af37]" />
            <span className="text-sm font-medium text-[#d4af37]">Member + creator plans</span>
          </div>
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">Choose the right plan family</h2>
          <p className="mx-auto mb-5 max-w-2xl text-gray-400">
            Start free, support the platform as a member, or step into the creator plan when you need lower fees and deeper tools.
          </p>
          <div className="mx-auto mb-8 flex max-w-3xl flex-wrap items-center justify-center gap-3 text-xs uppercase tracking-[0.16em] text-[#d4af37]/75">
            <span className="rounded-full border border-[#d4af37]/14 bg-[#d4af37]/6 px-3 py-1.5">Most earnings go directly to creators</span>
            <span className="rounded-full border border-[#d4af37]/14 bg-[#d4af37]/6 px-3 py-1.5">Verified Indigenous creators</span>
            <span className="rounded-full border border-[#d4af37]/14 bg-[#d4af37]/6 px-3 py-1.5">Community-supported marketplace</span>
          </div>

          <div className="inline-flex items-center gap-4 rounded-full border border-[#d4af37]/20 bg-[#0a0a0a] p-1">
            <button
              onClick={() => setIsAnnual(false)}
              className={`rounded-full px-6 py-2 text-sm font-medium transition-all ${
                !isAnnual ? 'bg-[#d4af37] text-black' : 'text-gray-400 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`flex items-center gap-2 rounded-full px-6 py-2 text-sm font-medium transition-all ${
                isAnnual ? 'bg-[#d4af37] text-black' : 'text-gray-400 hover:text-white'
              }`}
            >
              Annual
              <span className="rounded-full bg-[#DC143C] px-2 py-0.5 text-xs text-white">Save more</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {cards.map(({ plan, Icon, price, savings }) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl p-6 transition-all hover:scale-105 ${
                plan.id === 'creator'
                  ? 'border-2 border-[#d4af37] bg-gradient-to-b from-[#d4af37]/20 to-[#141414]'
                  : 'border border-[#d4af37]/20 bg-[#141414] hover:border-[#d4af37]/40'
              }`}
            >
              {(plan.id === 'creator' || plan.id === 'all-access') && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-[#d4af37] px-4 py-1 text-sm font-bold text-black">
                  {plan.id === 'creator' ? 'Best creator plan' : 'Best member value'}
                </div>
              )}

              {isAnnual && savings > 0 && (
                <div className="absolute right-4 top-4 rounded-full bg-[#DC143C]/20 px-2 py-1 text-xs text-[#DC143C]">
                  Save ${savings.toFixed(2)}/year
                </div>
              )}

              <div
                className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${
                  plan.id === 'creator'
                    ? 'bg-[#d4af37] text-black'
                    : plan.id === 'community'
                      ? 'bg-pink-500/20 text-pink-400'
                      : plan.id === 'all-access'
                        ? 'bg-purple-500/20 text-purple-400'
                        : 'bg-[#d4af37]/10 text-[#d4af37]'
                }`}
              >
                <Icon size={24} />
              </div>

              <h3 className="mb-1 text-lg font-bold text-white">{plan.name}</h3>
              <p className="mb-4 text-xs text-gray-400">{plan.description}</p>

              <div className="mb-6 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-white">{price === 0 ? 'Free' : `$${price}`}</span>
                {price > 0 && <span className="text-sm text-gray-400">/{isAnnual ? 'year' : 'month'}</span>}
              </div>

              <ul className="mb-6 space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature.label} className="flex items-start gap-2">
                    <div
                      className={`mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full ${
                        plan.id === 'creator'
                          ? 'bg-[#d4af37] text-black'
                          : 'bg-[#d4af37]/20 text-[#d4af37]'
                      }`}
                    >
                      <Check size={10} strokeWidth={3} />
                    </div>
                    <span className={`text-xs ${feature.emphasis ? 'font-medium text-white' : 'text-gray-300'}`}>{feature.label}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => handlePlanSelect(plan.id)}
                disabled={workingPlanId === plan.id}
                className={`w-full rounded-xl py-2.5 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-60 ${
                  plan.id === 'creator'
                    ? 'bg-[#d4af37] text-black hover:bg-[#f4e4a6]'
                    : price === 0
                      ? 'border border-[#d4af37]/30 bg-[#0a0a0a] text-white hover:border-[#d4af37]'
                      : 'border border-[#d4af37]/30 bg-[#d4af37]/10 text-[#d4af37] hover:bg-[#d4af37]/20'
                }`}
              >
                {workingPlanId === plan.id ? 'Opening checkout...' : price === 0 ? 'Get started' : isAnnual ? 'Choose annual' : 'Choose monthly'}
              </button>
            </div>
          ))}
        </div>

        {message ? (
          <div className="mx-auto mt-6 max-w-2xl rounded-2xl border border-[#d4af37]/20 bg-[#141414] px-4 py-3 text-center text-sm text-white">
            {message}
          </div>
        ) : null}

        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <Shield size={18} className="text-[#d4af37]" />
            <span>Clear billing and fee visibility</span>
          </div>
          <div className="flex items-center gap-2">
            <Check size={18} className="text-[#d4af37]" />
            <span>Annual savings shown upfront</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-[#d4af37]" />
            <span>Separate member and creator paths</span>
          </div>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-2xl border border-[#d4af37]/15 bg-[#0f0f0f] p-6">
            <p className="text-xs uppercase tracking-[0.22em] text-[#d4af37]/75">Premium visibility</p>
            <h3 className="mt-3 text-2xl font-bold text-white">Only 7 homepage premium spots exist.</h3>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-300">
              Premium placement is intentionally scarce so it feels curated, high-status, and trustworthy. These spots are distributed across the homepage story arc, not stacked into one ad cluster.
            </p>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-[#f4e4a6]">
              Only 7 homepage premium spots are available at any time. They are high-visibility placements seen by every visitor moving through the main discovery arc.
            </p>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-gray-300">
              Reserved for high-visibility creators, collections, campaigns, and editorial moments that deserve stronger front-page discovery.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5, 6, 7].map((dot) => (
                  <span
                    key={dot}
                    className={`h-2.5 w-2.5 rounded-full ${dot <= 5 ? 'bg-[#d4af37]' : 'border border-[#d4af37]/35 bg-transparent'}`}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-300">Currently 5 of 7 filled.</p>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {['Hero Spotlight', 'Spotlight Drop', 'Featured Collections', 'Featured Auctions', 'Creator Spotlight', 'Featured Experiences', 'Final Spotlight'].map((spot) => (
                <span key={spot} className="rounded-full border border-[#d4af37]/18 bg-[#141414] px-3 py-1.5 text-xs text-gray-300">
                  {spot}
                </span>
              ))}
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-[#d4af37]/10 bg-[#141414] p-4">
                <p className="text-sm font-semibold text-white">Included homepage lanes</p>
                <p className="mt-2 text-sm text-gray-400">Hero Spotlight, Spotlight Drop, Featured Collections, Featured Auctions, Creator Spotlight, Featured Experiences, and the Final Spotlight.</p>
              </div>
              <div className="rounded-xl border border-[#d4af37]/10 bg-[#141414] p-4">
                <p className="text-sm font-semibold text-white">Why it matters</p>
                <p className="mt-2 text-sm text-gray-400">Front-page exposure, higher discovery, and curated placement make scarcity valuable for creators while still feeling trustworthy to buyers.</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center lg:justify-end">
            <Link
              href="/subscription"
              className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/30 bg-[#141414] px-8 py-4 font-semibold text-[#d4af37] transition-all hover:border-[#d4af37] hover:bg-[#d4af37]/10"
            >
              View full pricing families
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

