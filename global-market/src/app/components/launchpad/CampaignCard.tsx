import Link from 'next/link';
import { BadgeCheck, Clock3, Radio, Users } from 'lucide-react';
import type { LaunchpadCampaign } from '@/app/lib/launchpad';
import CampaignProgress from './CampaignProgress';
import MomentumBadge from './MomentumBadge';
import TransparencyBreakdown from './TransparencyBreakdown';
import { getCampaignMissionLine, getImpactAreaMeta, getMomentumLabels } from './launchpadPresentation';

export default function CampaignCard({ campaign }: { campaign: LaunchpadCampaign }) {
  const area = getImpactAreaMeta(campaign.category);
  const momentum = getMomentumLabels(campaign);

  return (
    <article className="group overflow-hidden rounded-[30px] border border-[#d4af37]/12 bg-[linear-gradient(180deg,rgba(20,20,20,0.98),rgba(8,8,8,0.94))] transition-all hover:border-[#d4af37]/35 hover:shadow-[0_24px_60px_rgba(0,0,0,0.34)]">
      <div className="relative h-64 overflow-hidden">
        <img src={campaign.image} alt={campaign.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/28 to-transparent" />
        <div className="absolute left-5 top-5 flex flex-wrap gap-2">
          <span className="rounded-full border border-white/15 bg-black/35 px-3 py-1 text-xs uppercase tracking-[0.18em] text-[#d4af37]">
            {area.label}
          </span>
          {campaign.linkedAccountSlug ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-xs text-sky-200">
              <BadgeCheck size={12} />
              Verified
            </span>
          ) : null}
        </div>
        <div className="absolute inset-x-0 bottom-0 p-5">
          <div className="flex flex-wrap gap-2">
            {momentum.map((label) => <MomentumBadge key={label} label={label} />)}
          </div>
        </div>
      </div>
      <div className="space-y-5 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-2xl font-semibold leading-tight text-white">{campaign.title}</h3>
            <p className="mt-2 text-base text-[#f1e4bc]">{getCampaignMissionLine(campaign)}</p>
            <p className="mt-2 text-sm text-[#d4af37]">{campaign.beneficiaryName}</p>
          </div>
          <div className="rounded-full border border-white/10 bg-black/25 px-3 py-1 text-xs text-white/70">
            {campaign.closesInLabel}
          </div>
        </div>

        <p className="text-sm leading-7 text-gray-400">{campaign.summary}</p>

        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-[#d4af37]/20 bg-[#d4af37]/8 px-3 py-1 text-xs text-[#d4af37]">{area.label}</span>
          {campaign.campaignUpdates[0] ? (
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-300">
              Recent update
            </span>
          ) : null}
          {momentum.map((label) => <MomentumBadge key={`inline-${label}`} label={label} />)}
        </div>

        <CampaignProgress campaign={campaign} />

        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-[18px] border border-white/10 bg-black/18 p-3">
            <p className="text-[11px] uppercase tracking-[0.18em] text-gray-500">Backers</p>
            <p className="mt-2 text-lg font-semibold text-white">{campaign.sponsorCount}</p>
          </div>
          <div className="rounded-[18px] border border-white/10 bg-black/18 p-3">
            <p className="text-[11px] uppercase tracking-[0.18em] text-gray-500">Days left</p>
            <p className="mt-2 text-lg font-semibold text-white">{campaign.closesInLabel}</p>
          </div>
          <div className="rounded-[18px] border border-white/10 bg-black/18 p-3">
            <p className="text-[11px] uppercase tracking-[0.18em] text-gray-500">Updates</p>
            <p className="mt-2 text-lg font-semibold text-white">{campaign.campaignUpdates.length}</p>
          </div>
        </div>

        <TransparencyBreakdown campaign={campaign} title="Where your support goes" />

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5">
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
            <span className="inline-flex items-center gap-1">
              <Users size={14} />
              {campaign.sponsorCount} backers
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock3 size={14} />
              {campaign.closesInLabel}
            </span>
            {campaign.campaignUpdates[0] ? (
              <span className="inline-flex items-center gap-1">
                <Radio size={14} />
                {campaign.campaignUpdates[0].postedLabel}
              </span>
            ) : null}
          </div>
          <Link href={`/launchpad/${campaign.slug}`} className="rounded-full bg-[#d4af37] px-5 py-2.5 text-sm font-semibold text-black hover:bg-[#f4d370]">
            Support Campaign
          </Link>
        </div>
      </div>
    </article>
  );
}
