'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { AttorneyCard, CampaignCard, ResourceCard, usePillar9Data } from '@/app/advocacy-legal/components/AdvocacyCards';
import { fetchAdvocacyPublicData } from '@/app/lib/advocacyLegalClientStore';
import type { Attorney, Campaign, Resource, Victory } from '@/app/advocacy-legal/data/pillar9Data';

type Mode = 'attorneys' | 'campaigns' | 'resources';

export default function AdvocacyLegalMarketplace() {
  const fallback = usePillar9Data();
  const [publicData, setPublicData] = useState<{
    attorneys: Attorney[];
    campaigns: Campaign[];
    resources: Resource[];
    victories: Victory[];
    stats?: {
      activeProfessionals: number;
      liveCampaigns: number;
      resources: number;
      emergencyFundUsd: number;
    };
  } | null>(null);
  const [mode, setMode] = useState<Mode>('attorneys');
  const [search, setSearch] = useState('');

  useEffect(() => {
    let active = true;
    (async () => {
      const data = await fetchAdvocacyPublicData();
      if (!active || !data || typeof data !== 'object') return;
      setPublicData(data as {
        attorneys: Attorney[];
        campaigns: Campaign[];
        resources: Resource[];
        victories: Victory[];
        stats?: {
          activeProfessionals: number;
          liveCampaigns: number;
          resources: number;
          emergencyFundUsd: number;
        };
      });
    })();
    return () => {
      active = false;
    };
  }, []);

  const attorneys = publicData?.attorneys ?? fallback.attorneys;
  const campaigns = publicData?.campaigns ?? fallback.campaigns;
  const resources = publicData?.resources ?? fallback.resources;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return { attorneys, campaigns, resources };
    return {
      attorneys: attorneys.filter((x) => `${x.name} ${x.specialty} ${x.nation} ${x.region}`.toLowerCase().includes(q)),
      campaigns: campaigns.filter((x) => `${x.title} ${x.summary} ${x.region}`.toLowerCase().includes(q)),
      resources: resources.filter((x) => `${x.title} ${x.summary} ${x.kind} ${x.audience}`.toLowerCase().includes(q))
    };
  }, [search, attorneys, campaigns, resources]);

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-[#d4af37]/20 bg-[#101112] p-5 md:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.22)]">
        <div className="grid gap-5 md:grid-cols-[1fr,420px]">
          <div className="space-y-3">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-[#d4af37]/70">Browse the legal network</p>
              <h2 className="mt-2 text-3xl font-semibold text-white">Search professionals, campaigns, and rights tools</h2>
              <p className="mt-2 max-w-3xl text-sm leading-7 text-gray-300">
                This page is built for direct discovery. Search by issue, jurisdiction, urgency, or resource type and move straight into the right legal surface.
              </p>
            </div>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search attorneys, campaigns, rights guides, treaty, ICIP, land defense"
              className="rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-[#d4af37]/45"
            />
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-[#d4af37]/70">Browse mode</p>
              <p className="mt-2 text-sm leading-7 text-gray-300">
                Switch between attorneys, live campaigns, and legal resources without leaving the search surface.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {([
                ['attorneys', 'Attorneys'],
                ['campaigns', 'Campaigns'],
                ['resources', 'Resources']
              ] as Array<[Mode, string]>).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setMode(id)}
                  className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                    mode === id
                      ? 'border-[#d4af37]/60 bg-[#d4af37]/15 text-[#d4af37]'
                      : 'border-white/20 text-gray-300 hover:border-[#d4af37]/30'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {mode === 'attorneys' ? (
        <section className="space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-[#d4af37]/70">Attorney results</p>
            <h3 className="mt-2 text-2xl font-semibold text-white">Browse verified legal professionals</h3>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filtered.attorneys.map((item) => (
              <AttorneyCard key={item.id} item={item} />
            ))}
            {filtered.attorneys.length === 0 ? (
              <article className="md:col-span-2 xl:col-span-3 rounded-xl border border-white/15 bg-black/25 p-6 text-center">
                <p className="text-base font-semibold text-white">No attorneys match your search</p>
                <p className="mt-1 text-sm text-gray-400">Try searching by nation, specialty, treaty, ICIP, or jurisdiction.</p>
                <div className="mt-3 flex justify-center gap-2">
                  <Link href="/advocacy-legal/pro-bono-application" className="rounded-full border border-[#d4af37]/35 px-3 py-1.5 text-xs text-[#d4af37] hover:bg-[#d4af37]/10">
                    Apply for Pro Bono
                  </Link>
                  <Link href="/advocacy-legal/submit-case" className="rounded-full border border-[#d4af37]/35 px-3 py-1.5 text-xs text-[#d4af37] hover:bg-[#d4af37]/10">
                    Submit Case
                  </Link>
                </div>
              </article>
            ) : null}
          </div>
        </section>
      ) : null}

      {mode === 'campaigns' ? (
        <section className="space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-[#d4af37]/70">Campaign results</p>
            <h3 className="mt-2 text-2xl font-semibold text-white">Browse live defense and policy campaigns</h3>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filtered.campaigns.map((item) => (
              <CampaignCard key={item.id} item={item} />
            ))}
            {filtered.campaigns.length === 0 ? (
              <article className="md:col-span-2 xl:col-span-3 rounded-xl border border-white/15 bg-black/25 p-6 text-center">
                <p className="text-base font-semibold text-white">No campaigns match your search</p>
                <p className="mt-1 text-sm text-gray-400">Try broader keywords or go directly to the emergency defense fund.</p>
                <div className="mt-3 flex justify-center">
                  <Link href="/advocacy-legal/emergency-defense-fund" className="rounded-full border border-[#d4af37]/35 px-3 py-1.5 text-xs text-[#d4af37] hover:bg-[#d4af37]/10">
                    Emergency Defense Fund
                  </Link>
                </div>
              </article>
            ) : null}
          </div>
        </section>
      ) : null}

      {mode === 'resources' ? (
        <section className="space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-[#d4af37]/70">Resource results</p>
            <h3 className="mt-2 text-2xl font-semibold text-white">Browse practical legal tools and rights guides</h3>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filtered.resources.map((item) => (
              <ResourceCard key={item.id} item={item} />
            ))}
            {filtered.resources.length === 0 ? (
              <article className="md:col-span-2 xl:col-span-3 rounded-xl border border-white/15 bg-black/25 p-6 text-center">
                <p className="text-base font-semibold text-white">No resources match your search</p>
                <p className="mt-1 text-sm text-gray-400">Try another keyword or move into the action center.</p>
                <div className="mt-3 flex justify-center">
                  <Link href="/advocacy-legal/action-center" className="rounded-full border border-[#d4af37]/35 px-3 py-1.5 text-xs text-[#d4af37] hover:bg-[#d4af37]/10">
                    Open Action Center
                  </Link>
                </div>
              </article>
            ) : null}
          </div>
        </section>
      ) : null}
    </div>
  );
}
