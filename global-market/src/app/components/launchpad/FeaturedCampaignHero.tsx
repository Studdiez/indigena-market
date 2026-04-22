import Link from 'next/link';
import { ArrowRight, BadgeCheck, Clock3, HeartHandshake, Users } from 'lucide-react';
import type { LaunchpadCampaign } from '@/app/lib/launchpad';
import CampaignProgress from './CampaignProgress';
import TransparencyBreakdown from './TransparencyBreakdown';
import { getImpactAreaMeta, getTrustSignals } from './launchpadPresentation';

export default function FeaturedCampaignHero({ campaign }: { campaign: LaunchpadCampaign }) {
  const area = getImpactAreaMeta(campaign.category);
  const trustSignals = getTrustSignals(campaign);
  const backerFaces = campaign.recentBackers.slice(0, 5).map((backer) => ({
    name: backer.name,
    initials: backer.name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()
  }));
  const urgencyTone = campaign.closesInLabel.toLowerCase().includes('7 days')
    ? 'Funding closing soon'
    : campaign.sponsorCount >= 50
      ? 'Strong supporter momentum'
      : 'Backing window open now';

  return (
    <section className="relative overflow-hidden px-6 py-14 md:py-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(220,20,60,0.14),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(212,175,55,0.14),transparent_28%)]" />
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 xl:grid-cols-[1.1fr,0.9fr] xl:items-end">
          <article className="overflow-hidden rounded-[34px] border border-[#d4af37]/18 bg-[linear-gradient(180deg,rgba(20,20,20,0.98),rgba(8,8,8,0.94))] shadow-[0_28px_80px_rgba(0,0,0,0.34)]">
            <div className="grid gap-0 lg:grid-cols-[1.08fr,0.92fr]">
              <div className="relative min-h-[440px] overflow-hidden">
                <img src={campaign.image} alt={campaign.title} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#090909]/94 via-[#090909]/52 to-transparent" />
                <div className="absolute left-6 top-6 flex flex-wrap gap-2">
                  <span className="rounded-full border border-white/15 bg-black/35 px-3 py-1 text-xs uppercase tracking-[0.18em] text-[#d4af37]">
                    Featured Campaign
                  </span>
                  <span className="rounded-full border border-white/15 bg-black/35 px-3 py-1 text-xs uppercase tracking-[0.18em] text-white/80">
                    {area.label}
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <p className="text-xs uppercase tracking-[0.22em] text-[#d4af37]">Funding Indigenous futures</p>
                  <h1 className="mt-3 max-w-3xl text-4xl font-bold leading-tight text-white md:text-5xl">
                    {campaign.title}
                  </h1>
                  <p className="mt-4 max-w-2xl text-lg leading-8 text-[#f1e4bc]">{campaign.summary}</p>
                  <div className="mt-5 rounded-[24px] border border-[#d4af37]/20 bg-black/28 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-[#d4af37]">Why this matters</p>
                    <div className="mt-3 space-y-2">
                      {campaign.impactPoints.slice(0, 3).map((point) => (
                        <div key={point} className="flex items-start gap-3 text-sm text-gray-200">
                          <span>{point.includes('language') ? '🌍' : point.includes('youth') || point.includes('teacher') ? '🎓' : '🧬'}</span>
                          <span>{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-gray-300">
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                      <BadgeCheck size={14} className="text-[#d4af37]" />
                      {campaign.beneficiaryName}
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                      <Users size={14} className="text-[#d4af37]" />
                      {campaign.sponsorCount} supporters
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                      <Clock3 size={14} className="text-[#d4af37]" />
                      {campaign.closesInLabel}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-5 p-6 md:p-8">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[20px] border border-white/10 bg-black/20 p-4">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-gray-500">Raised</p>
                    <p className="mt-2 text-3xl font-semibold text-white">${campaign.raisedAmount.toLocaleString()}</p>
                  </div>
                  <div className="rounded-[20px] border border-white/10 bg-black/20 p-4">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-gray-500">Goal</p>
                    <p className="mt-2 text-3xl font-semibold text-white">${campaign.goalAmount.toLocaleString()}</p>
                  </div>
                </div>

                <CampaignProgress campaign={campaign} />
                <div className="rounded-[24px] border border-white/10 bg-black/20 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-[#d4af37]">Recent supporters</p>
                      <p className="mt-1 text-sm text-gray-300">{campaign.sponsorCount} backers are already behind this campaign.</p>
                    </div>
                    <div className="flex -space-x-3">
                      {backerFaces.map((backer) => (
                        <div
                          key={backer.name}
                          className="flex h-10 w-10 items-center justify-center rounded-full border border-[#141414] bg-[linear-gradient(135deg,#d4af37,#8b6a10)] text-xs font-bold text-black"
                          title={backer.name}
                        >
                          {backer.initials}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full border border-[#DC143C]/30 bg-[#DC143C]/10 px-3 py-1 text-xs text-rose-200">{campaign.closesInLabel}</span>
                    <span className="rounded-full border border-[#d4af37]/20 bg-[#d4af37]/8 px-3 py-1 text-xs text-[#d4af37]">{urgencyTone}</span>
                  </div>
                </div>

                <TransparencyBreakdown campaign={campaign} title="Where your support goes" />

                <div className="flex flex-wrap gap-3">
                  <Link href={`/launchpad/${campaign.slug}`} className="rounded-full bg-[#d4af37] px-5 py-3 text-sm font-semibold text-black hover:bg-[#f4d370]">
                    Support This Campaign
                  </Link>
                  <Link href={`/launchpad/${campaign.slug}`} className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm text-white hover:border-[#d4af37]/35 hover:text-[#f3d57c]">
                    View Full Story
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            </div>
          </article>

          <div className="space-y-4">
            <div className="rounded-[28px] border border-[#d4af37]/16 bg-[linear-gradient(180deg,rgba(20,20,20,0.97),rgba(10,10,10,0.92))] p-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#d4af37]/10 px-3 py-1 text-xs font-medium text-[#d4af37]">
                <HeartHandshake size={13} />
                Trust and transparency
              </div>
              <div className="mt-5 space-y-4">
                {trustSignals.map((item) => (
                  <div key={item.label} className="rounded-[20px] border border-white/10 bg-black/20 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-[#d4af37]">{item.label}</p>
                    <p className="mt-2 text-sm leading-6 text-gray-300">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
