import Link from 'next/link';

export default function FinalMissionCTA() {
  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-[34px] border border-[#d4af37]/20 bg-[linear-gradient(135deg,rgba(24,18,8,0.98),rgba(10,10,10,0.96))] px-8 py-12 shadow-[0_28px_80px_rgba(0,0,0,0.34)]">
        <div className="grid gap-8 lg:grid-cols-[1fr,auto] lg:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[#d4af37]">Join the circle of support</p>
            <h2 className="mt-4 text-4xl font-bold leading-tight text-white">Support Indigenous futures through campaigns that are community-led, transparent, and built to last.</h2>
            <p className="mt-4 max-w-3xl text-base leading-8 text-gray-300">
              Back culture, learning, land-based work, infrastructure, and creator growth with direct contributions that show who is behind the campaign and how support will be used.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/launchpad/create" className="rounded-full bg-[#d4af37] px-5 py-3 text-sm font-semibold text-black hover:bg-[#f4d370]">
              Start a Campaign
            </Link>
            <Link href="/launchpad" className="rounded-full border border-white/10 px-5 py-3 text-sm text-white hover:border-[#d4af37]/35 hover:text-[#f3d57c]">
              Explore Campaigns
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
