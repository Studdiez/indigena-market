'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ArrowRight, BadgeCheck, HeartHandshake, MapPinned, Radio, ShieldCheck, Sparkles, Users } from 'lucide-react';
import type { LaunchpadCampaign } from '@/app/lib/launchpad';
import FeaturedCampaignHero from '@/app/components/launchpad/FeaturedCampaignHero';
import TrustBadgeRow from '@/app/components/launchpad/TrustBadgeRow';
import ImpactAreaCard from '@/app/components/launchpad/ImpactAreaCard';
import CampaignCard from '@/app/components/launchpad/CampaignCard';
import FinalMissionCTA from '@/app/components/launchpad/FinalMissionCTA';
import {
  getImpactAreaMeta,
  getTrustSignals,
  impactAreaMeta
} from '@/app/components/launchpad/launchpadPresentation';

const browseCategories = Object.keys(impactAreaMeta) as Array<LaunchpadCampaign['category']>;

const howLaunchpadWorks = [
  {
    step: '01',
    title: 'Discover a campaign',
    detail: 'Start with a clear story, a named organizer, and a specific community or creator mission.'
  },
  {
    step: '02',
    title: 'Contribute directly',
    detail: 'Choose a campaign that matters to you and contribute knowing the beneficiary, funding goal, and intended use.'
  },
  {
    step: '03',
    title: 'Track impact and updates',
    detail: 'Follow progress, milestone updates, and momentum as campaigns move from ask to real-world impact.'
  }
];

const whyBackLaunchpad = [
  {
    title: 'Direct impact',
    copy: 'Support reaches a named creator, organizer, or community-led initiative instead of disappearing into a generic fund.'
  },
  {
    title: 'Community-led causes',
    copy: 'Campaigns are rooted in Indigenous priorities: language, land, arts, infrastructure, travel, education, and urgent care.'
  },
  {
    title: 'Transparent funding',
    copy: 'Backers can see what is being raised, how funds will be used, and how progress is moving over time.'
  },
  {
    title: 'Culture that lasts',
    copy: 'Funding does more than solve a momentary need. It can preserve knowledge, grow capacity, and strengthen long-term community futures.'
  }
];

export default function LaunchpadClient({ campaigns }: { campaigns: LaunchpadCampaign[] }) {
  const [selectedCategory, setSelectedCategory] = useState<'all' | LaunchpadCampaign['category']>('all');
  const featuredCampaign = campaigns[0];
  const editorialCampaign = campaigns[1];

  const filteredCampaigns = useMemo(() => {
    const remaining = campaigns.slice(1);
    return selectedCategory === 'all'
      ? remaining
      : remaining.filter((campaign) => campaign.category === selectedCategory);
  }, [campaigns, selectedCategory]);

  const pageStats = useMemo(
    () => ({
      raised: campaigns.reduce((sum, campaign) => sum + campaign.raisedAmount, 0),
      supporters: campaigns.reduce((sum, campaign) => sum + campaign.sponsorCount, 0),
      communities: campaigns.filter((campaign) => campaign.category === 'community' || campaign.linkedAccountSlug).length,
      updates: campaigns.reduce((sum, campaign) => sum + campaign.campaignUpdates.length, 0)
    }),
    [campaigns]
  );

  const featuredTrustSignals = featuredCampaign ? getTrustSignals(featuredCampaign) : [];

  return (
    <>
      {featuredCampaign ? <FeaturedCampaignHero campaign={featuredCampaign} /> : null}

      <section className="px-6 pb-8">
        <div className="mx-auto max-w-7xl">
          <TrustBadgeRow items={featuredTrustSignals} />
        </div>
      </section>

      <section className="px-6 py-14">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 xl:grid-cols-[0.8fr,1.2fr]">
            <div className="rounded-[30px] border border-[#d4af37]/16 bg-[linear-gradient(180deg,rgba(20,20,20,0.98),rgba(8,8,8,0.92))] p-6">
              <p className="text-xs uppercase tracking-[0.22em] text-[#d4af37]">How Launchpad works</p>
              <h2 className="mt-4 text-3xl font-bold text-white">A simpler way to back community-led futures.</h2>
              <p className="mt-4 text-base leading-8 text-gray-300">
                Launchpad is where supporters find real campaigns, contribute directly, and stay connected to the impact that follows.
              </p>
              <div className="mt-6 grid gap-4">
                {[
                  { label: 'Total raised', value: `$${pageStats.raised.toLocaleString()}`, icon: HeartHandshake },
                  { label: 'Supporters across campaigns', value: pageStats.supporters.toLocaleString(), icon: Users },
                  { label: 'Campaign updates shared', value: pageStats.updates.toLocaleString(), icon: Radio },
                  { label: 'Community-linked campaigns', value: pageStats.communities.toLocaleString(), icon: ShieldCheck }
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="flex items-center justify-between rounded-[20px] border border-white/10 bg-black/20 p-4">
                    <div className="inline-flex items-center gap-2 text-[#d4af37]">
                      <Icon size={14} />
                      <span className="text-xs uppercase tracking-[0.18em]">{label}</span>
                    </div>
                    <span className="text-lg font-semibold text-white">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {howLaunchpadWorks.map((item) => (
                <div key={item.step} className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(20,20,20,0.94),rgba(8,8,8,0.88))] p-6">
                  <span className="text-sm font-semibold text-[#d4af37]">{item.step}</span>
                  <h3 className="mt-4 text-xl font-semibold text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-gray-300">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {editorialCampaign ? (
        <section className="px-6 py-14">
          <div className="mx-auto max-w-7xl overflow-hidden rounded-[34px] border border-[#d4af37]/18 bg-[linear-gradient(135deg,rgba(20,20,20,0.98),rgba(8,8,8,0.94))] shadow-[0_24px_70px_rgba(0,0,0,0.3)]">
            <div className="grid gap-0 lg:grid-cols-[0.92fr,1.08fr]">
              <div className="relative min-h-[360px] overflow-hidden">
                <img src={editorialCampaign.image} alt={editorialCampaign.title} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#090909]/90 via-[#090909]/40 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <p className="text-xs uppercase tracking-[0.22em] text-[#d4af37]">Featured campaign</p>
                  <h2 className="mt-3 max-w-2xl text-3xl font-bold text-white">{editorialCampaign.title}</h2>
                </div>
              </div>
              <div className="space-y-5 p-6 md:p-8">
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full border border-[#d4af37]/20 bg-[#d4af37]/8 px-3 py-1 text-xs text-[#d4af37]">{getImpactAreaMeta(editorialCampaign.category).label}</span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-300">{editorialCampaign.closesInLabel}</span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-300">{editorialCampaign.sponsorCount} backers</span>
                </div>
                <p className="text-lg leading-8 text-[#f1e4bc]">{editorialCampaign.summary}</p>
                <p className="text-sm leading-7 text-gray-300">{editorialCampaign.story}</p>
                <div className="rounded-[24px] border border-white/10 bg-black/20 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#d4af37]">Why supporters are backing this</p>
                  <div className="mt-3 space-y-2">
                    {editorialCampaign.impactPoints.slice(0, 3).map((point) => (
                      <div key={point} className="flex items-start gap-3 text-sm text-gray-300">
                        <span className="text-[#d4af37]">•</span>
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link href={`/launchpad/${editorialCampaign.slug}`} className="rounded-full bg-[#d4af37] px-5 py-3 text-sm font-semibold text-black hover:bg-[#f4d370]">
                    Support Campaign
                  </Link>
                  <Link href={`/launchpad/${editorialCampaign.slug}`} className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm text-white hover:border-[#d4af37]/35 hover:text-[#f3d57c]">
                    View Full Story
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section className="px-6 py-14">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[#d4af37]">Impact Areas</p>
              <h2 className="mt-3 text-3xl font-bold text-white">Choose the kind of future you want to fund.</h2>
              <p className="mt-3 max-w-3xl text-base leading-8 text-gray-300">
                Launchpad is organized around meaningful impact areas so backers can quickly find campaigns tied to education, culture, infrastructure, urgent care, and community growth.
              </p>
            </div>
            <Link href="/launchpad/create" className="rounded-full bg-[#d4af37] px-5 py-3 text-sm font-semibold text-black hover:bg-[#f4d370]">
              Start a Campaign
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {browseCategories.map((category) => {
              const area = getImpactAreaMeta(category);
              const areaCampaigns = campaigns.filter((campaign) => campaign.category === category);
              return (
                <ImpactAreaCard
                  key={category}
                  area={area}
                  campaignCount={areaCampaigns.length}
                  totalRaised={areaCampaigns.reduce((sum, campaign) => sum + campaign.raisedAmount, 0)}
                  selected={selectedCategory === category}
                  onClick={() => setSelectedCategory(selectedCategory === category ? 'all' : category)}
                />
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-6 py-14 bg-[#0d0d0d] border-y border-[#d4af37]/10">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 xl:grid-cols-[0.78fr,1.22fr]">
            <div className="rounded-[30px] border border-[#d4af37]/15 bg-[linear-gradient(180deg,rgba(20,20,20,0.98),rgba(8,8,8,0.92))] p-6">
              <p className="text-xs uppercase tracking-[0.22em] text-[#d4af37]">Why people back campaigns</p>
              <h2 className="mt-4 text-3xl font-bold text-white">Cause-driven support needs trust, clarity, and a reason to act now.</h2>
              <p className="mt-4 text-base leading-8 text-gray-300">
                People back Launchpad campaigns when they understand the story, trust the organizer, and can see what their support will unlock.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {whyBackLaunchpad.map((item) => (
                <div key={item.title} className="rounded-[26px] border border-white/10 bg-[#141414] p-5">
                  <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-gray-300">{item.copy}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-14">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[#d4af37]">Campaigns to back now</p>
              <h2 className="mt-3 text-3xl font-bold text-white">
                {selectedCategory === 'all' ? 'Curated campaigns with real impact behind them.' : `${getImpactAreaMeta(selectedCategory).title} campaigns`}
              </h2>
              <p className="mt-3 max-w-3xl text-base leading-8 text-gray-300">
                These campaigns are organized to feel human first: who is behind them, what they need, where funds go, and why support matters right now.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`rounded-full px-4 py-2 text-sm transition-all ${selectedCategory === 'all' ? 'bg-[#d4af37] text-black font-semibold' : 'border border-white/10 bg-white/5 text-white hover:border-[#d4af37]/35'}`}
              >
                All impact areas
              </button>
              {browseCategories.slice(0, 4).map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full px-4 py-2 text-sm transition-all ${selectedCategory === category ? 'bg-[#d4af37] text-black font-semibold' : 'border border-white/10 bg-white/5 text-white hover:border-[#d4af37]/35'}`}
                >
                  {getImpactAreaMeta(category).label}
                </button>
              ))}
            </div>
          </div>

          {filteredCampaigns.length > 0 ? (
            <div className="grid gap-10 lg:grid-cols-2">
              {filteredCampaigns.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </div>
          ) : (
            <div className="rounded-[30px] border border-[#d4af37]/16 bg-[linear-gradient(180deg,rgba(20,20,20,0.97),rgba(8,8,8,0.9))] p-10 text-center">
              <p className="text-sm uppercase tracking-[0.2em] text-[#d4af37]">No campaigns in this area yet</p>
              <h3 className="mt-3 text-2xl font-semibold text-white">This impact area is ready for its next story.</h3>
              <p className="mt-3 text-sm leading-7 text-gray-300">
                Switch impact areas or start a campaign that brings this lane to life for backers.
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('all')}
                  className="rounded-full border border-white/10 px-5 py-3 text-sm text-white hover:border-[#d4af37]/35 hover:text-[#f3d57c]"
                >
                  View all campaigns
                </button>
                <Link href="/launchpad/create" className="rounded-full bg-[#d4af37] px-5 py-3 text-sm font-semibold text-black hover:bg-[#f4d370]">
                  Start a campaign
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="px-6 py-14">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[34px] border border-[#d4af37]/18 bg-[linear-gradient(135deg,rgba(20,20,20,0.98),rgba(8,8,8,0.94))] p-8">
          <div className="grid gap-8 xl:grid-cols-[0.9fr,1.1fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[#d4af37]">Momentum and social proof</p>
              <h2 className="mt-4 text-3xl font-bold text-white">Backers move when they can see momentum building.</h2>
              <p className="mt-4 text-base leading-8 text-gray-300">
                Launchpad surfaces progress, updates, and real supporter activity so each campaign feels alive and accountable.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {campaigns.slice(0, 4).map((campaign) => (
                <div key={campaign.id} className="rounded-[24px] border border-white/10 bg-black/20 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-white">{campaign.title}</p>
                    <span className="rounded-full border border-[#d4af37]/20 bg-[#d4af37]/8 px-2.5 py-1 text-[11px] text-[#d4af37]">
                      {campaign.sponsorCount} backers
                    </span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-gray-300">
                      <MapPinned size={12} />
                      {campaign.location}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-gray-300">
                      <Sparkles size={12} />
                      {campaign.urgencyLabel}
                    </span>
                    {campaign.campaignUpdates[0] ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-gray-300">
                        <Radio size={12} />
                        {campaign.campaignUpdates[0].postedLabel}
                      </span>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <FinalMissionCTA />
    </>
  );
}
