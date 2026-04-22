import Link from 'next/link';
import AdvocacyFrame from './components/AdvocacyFrame';
import AdvocacyHero from './components/AdvocacyHero';
import { AttorneyCard, CampaignCard, LegalStatsStrip, QuickActionRail, ResourceCard, VictoryCard } from './components/AdvocacyCards';
import ProtectionPulseBoard from './components/ProtectionPulseBoard';
import { getAdvocacyPublicData } from '@/app/lib/advocacyLegalPublicData';

export default async function AdvocacyLegalHomePage() {
  const { attorneys, campaigns, resources, victories, stats } = await getAdvocacyPublicData();
  const whyThisMatters = [
    {
      title: 'Legal systems often exclude Indigenous sovereignty',
      description: 'Communities are forced to navigate systems that frequently ignore treaty standing, protocol, and self-determined governance.'
    },
    {
      title: 'Land, water, and rights require active defense',
      description: 'When extraction, criminalization, or policy threats move quickly, legal response has to move just as fast.'
    },
    {
      title: 'Coordinated support protects communities at scale',
      description: 'Counsel, campaigns, tools, and emergency funding work best when they are linked into one defense infrastructure.'
    }
  ];

  const howItWorks = [
    'Report or discover a case',
    'Connect legal support',
    'Fund or mobilize defense',
    'Track outcomes'
  ];

  return (
    <AdvocacyFrame
      title="Advocacy & Legal"
      subtitle="Legal protection infrastructure for Indigenous rights defense, land protection, and coordinated community response."
    >
      <AdvocacyHero
        title="Legal Protection Infrastructure for Indigenous Communities"
        description="Urgent cases, land defense campaigns, and legal support systems coordinated in real time for communities protecting rights, land, water, and sovereignty."
        image="https://images.unsplash.com/photo-1528747045269-390fe33c19d3?w=1800&h=900&fit=crop"
        urgencySignals={['Active cases now', 'Emergency response available']}
        humanLine="Protect land, culture, and communities through coordinated legal defense."
      />

      <section className="rounded-[28px] border border-[#d4af37]/20 bg-[linear-gradient(135deg,rgba(20,16,16,0.98),rgba(12,12,14,0.98))] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.22)]">
        <p className="text-xs uppercase tracking-[0.28em] text-[#d4af37]">Why this matters</p>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {whyThisMatters.map((item) => (
            <article key={item.title} className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-sm font-semibold text-white">{item.title}</p>
              <p className="mt-2 text-sm leading-6 text-gray-400">{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Link href="/advocacy-legal/attorneys" className="rounded-2xl border border-[#d4af37]/20 bg-[#101112] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.22)] transition-colors hover:border-[#d4af37]/35">
          <p className="text-xs uppercase tracking-[0.24em] text-[#d4af37]">Get counsel</p>
          <h2 className="mt-2 text-xl font-semibold text-white">Book a vetted attorney or advocate</h2>
          <p className="mt-2 text-sm text-gray-300">Go directly to professionals by specialty, urgency, and access fit.</p>
        </Link>
        <Link href="/advocacy-legal/campaigns" className="rounded-2xl border border-[#d4af37]/20 bg-[#101112] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.22)] transition-colors hover:border-[#d4af37]/35">
          <p className="text-xs uppercase tracking-[0.24em] text-[#d4af37]">Fund defense</p>
          <h2 className="mt-2 text-xl font-semibold text-white">Back live legal and land-defense campaigns</h2>
          <p className="mt-2 text-sm text-gray-300">See urgent cases first, then move into structured long-term campaigns.</p>
        </Link>
        <Link href="/advocacy-legal/resources" className="rounded-2xl border border-[#d4af37]/20 bg-[#101112] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.22)] transition-colors hover:border-[#d4af37]/35">
          <p className="text-xs uppercase tracking-[0.24em] text-[#d4af37]">Use resources</p>
          <h2 className="mt-2 text-xl font-semibold text-white">Open templates, rights guides, and training</h2>
          <p className="mt-2 text-sm text-gray-300">Get to practical legal tools without scrolling through institutional context first.</p>
        </Link>
      </section>

      <QuickActionRail />
      <LegalStatsStrip stats={stats} />
      <ProtectionPulseBoard />

      <section className="rounded-2xl border border-[#d4af37]/20 bg-[#101112] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.22)]">
        <p className="text-xs uppercase tracking-[0.28em] text-[#d4af37]/80">How it works</p>
        <div className="mt-4 grid gap-3 md:grid-cols-4">
          {howItWorks.map((step, index) => (
            <article key={step} className="rounded-xl border border-white/10 bg-black/20 p-4">
              <p className="text-[10px] uppercase tracking-[0.22em] text-gray-500">Step {index + 1}</p>
              <p className="mt-2 text-sm font-medium text-white">{step}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-[#d4af37]/70">Start With Counsel</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Verified legal professionals ready for rights defense work</h2>
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
        {attorneys.slice(0, 3).map((item) => <AttorneyCard key={item.id} item={item} />)}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-[#d4af37]/70">Fund Active Defense</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Fund the cases, land defenses, and policy fights moving right now</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
        {campaigns.map((item) => <CampaignCard key={item.id} item={item} />)}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-[#d4af37]/70">Use A Legal Tool</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Know-your-rights tools and legal guides built for immediate use</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {resources.map((item) => <ResourceCard key={item.id} item={item} />)}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-[#d4af37]/70">Victory Archive</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">What protection makes possible</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
        {victories.map((item) => <VictoryCard key={item.id} item={item} />)}
        </div>
      </section>

      <section className="rounded-[30px] border border-[#d4af37]/20 bg-[linear-gradient(135deg,rgba(20,16,16,0.98),rgba(10,10,12,0.98))] p-6 md:p-7">
        <p className="text-[11px] uppercase tracking-[0.28em] text-[#d4af37]">Stand behind Indigenous rights and land protection</p>
        <h2 className="mt-3 text-3xl font-semibold text-white">Stand behind Indigenous rights and land protection.</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-300">
          Move from concern into action through counsel, coordinated funding, and practical legal tools designed for time-sensitive community defense.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/advocacy-legal/attorneys" className="rounded-full bg-[#d4af37] px-5 py-3 text-sm font-semibold text-black hover:bg-[#f4d370]">
            Get Legal Support
          </Link>
          <Link href="/advocacy-legal/campaigns" className="rounded-full border border-[#d4af37]/35 px-5 py-3 text-sm font-medium text-[#d4af37] hover:bg-[#d4af37]/10">
            Fund a Case
          </Link>
          <Link href="/advocacy-legal/resources" className="rounded-full border border-[#d4af37]/35 px-5 py-3 text-sm font-medium text-[#d4af37] hover:bg-[#d4af37]/10">
            Access Tools
          </Link>
        </div>
      </section>
    </AdvocacyFrame>
  );
}



