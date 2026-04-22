import Link from 'next/link';
import LandFoodFrame from './components/LandFoodFrame';
import LandFoodHero from './components/LandFoodHero';
import { ProductCard, ProducerCard, ProjectCard, StatsStrip, RegenerativeImpactBand } from './components/LandFoodCards';
import { products, producers, projects } from './data/pillar8Data';

export default function LandFoodHomePage() {
  const whyThisMatters = [
    {
      title: 'Supports Indigenous food sovereignty',
      description: 'Every basket, wholesale order, and stewardship contract keeps food systems rooted in Indigenous control and continuity.'
    },
    {
      title: 'Restores land through regenerative practice',
      description: 'Purchases and projects help finance seed stewardship, biodiversity protection, and on-country restoration.'
    },
    {
      title: 'Keeps value within communities',
      description: 'Revenue, stewardship shares, and long-term procurement stay connected to the people carrying the work.'
    }
  ];

  const trending = [
    {
      title: 'Wild Rice Harvest Pack',
      metric: '+320 wishlists this week',
      image: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=1200&h=700&fit=crop',
      tag: 'High demand'
    },
    {
      title: 'Tepary Seed Kit',
      metric: 'Top barter demand',
      image: 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=1200&h=700&fit=crop',
      tag: 'Seasonal harvest'
    },
    {
      title: 'Wetland Carbon Guardianship',
      metric: 'Fastest-funded project',
      image: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=1200&h=700&fit=crop',
      tag: 'Conservation project'
    },
    {
      title: 'Native Plant Dye Collection',
      metric: 'Most shared listing',
      image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=1200&h=700&fit=crop',
      tag: 'Community spotlight'
    }
  ];

  const curatedSystems = [
    {
      title: 'Desert Seed Systems',
      description: 'Dryland grains, heirloom seeds, and resilient foodways carried through intergenerational desert farming knowledge.',
      emotionalLine: 'Sustaining drought-resistant food traditions through Indigenous seed stewardship.',
      href: '/land-food/seed-swap'
    },
    {
      title: 'Coastal Harvest Cycles',
      description: 'Seasonal gathering, wetland stewardship, and ocean-adjacent food systems connected to harvest timing and habitat care.',
      emotionalLine: 'Holding harvest, habitat, and food knowledge together through seasonal community care.',
      href: '/land-food/harvest-calendar'
    },
    {
      title: 'Regenerative Grain Networks',
      description: 'Community-milled staples, seed protection, and wholesale pathways for buyers investing in long-term food sovereignty.',
      emotionalLine: 'Turning staple foods into long-term community resilience, revenue, and seed continuity.',
      href: '/land-food/marketplace'
    }
  ];

  const rankedCommunities = [
    { name: 'Red River Food Sovereignty Co-op', score: 98, label: 'Top fulfillment quality' },
    { name: 'Te Awa Regenerative Collective', score: 95, label: 'Best stewardship impact' },
    { name: 'Desert Seed Keepers', score: 93, label: 'Highest seed demand' }
  ];

  return (
    <LandFoodFrame title="Land & Food" subtitle="Regenerative economy marketplace for Indigenous food systems and land stewardship.">
      <LandFoodHero
        eyebrow="Pillar 8"
        title="Food Sovereignty Meets Regenerative Commerce"
        description="Participate in a living Indigenous food economy through verified harvests, community-owned supply, and regenerative stewardship rooted in land relationships."
        image="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1800&h=900&fit=crop"
        chips={['Community Verified', 'Traceability First', 'Direct-to-Community Payments']}
        actions={[
          { href: '/land-food/marketplace', label: 'Shop Seasonal Harvests' },
          { href: '/land-food/services/conservation-carbon-projects', label: 'Fund Stewardship', tone: 'secondary' }
        ]}
      />

      <section className="rounded-[28px] border border-[#d4af37]/20 bg-[linear-gradient(135deg,rgba(18,18,14,0.98),rgba(10,10,9,0.98))] p-5 md:p-6">
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-[#d4af37]">Why this matters</p>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {whyThisMatters.map((item) => (
              <article key={item.title} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-sm font-semibold text-white">{item.title}</p>
                <p className="mt-2 text-sm leading-6 text-gray-400">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-[#d4af37]/20 bg-[#10110f] p-4 md:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[#d4af37]">Choose how you want to participate</p>
            <h2 className="mt-1 text-xl font-semibold text-white">Move through harvest, sourcing, and stewardship with clearer intent</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              ['/land-food/marketplace', 'Shop seasonal harvests'],
              ['/land-food/wholesale-inquiry', 'Source directly from producers'],
              ['/land-food/services/conservation-carbon-projects', 'Support land stewardship'],
              ['/land-food/harvest-calendar', 'Follow harvest cycles'],
              ['/land-food/seed-swap', 'Protect seed systems'],
            ].map(([href, label]) => (
              <Link key={href} href={href} className="rounded-full border border-[#d4af37]/30 bg-black/30 px-4 py-2 text-sm text-[#d4af37] transition-colors hover:bg-[#d4af37]/10">
                {label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <StatsStrip />

      <section className="space-y-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-[#d4af37]">Discover</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">Curated food systems, seasonal goods, and producer-led supply</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-400">
              Start with ecosystems, not just items. Each lane reveals a different way communities grow, harvest, process, and steward value.
            </p>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {curatedSystems.map((system) => (
            <Link
              key={system.title}
              href={system.href}
              className="rounded-2xl border border-[#d4af37]/18 bg-[#10110f] p-5 transition-all hover:-translate-y-1 hover:border-[#d4af37]/35"
            >
              <p className="text-[11px] uppercase tracking-[0.24em] text-[#d4af37]">Curated system</p>
              <h3 className="mt-4 text-xl font-semibold text-white">{system.title}</h3>
              <p className="mt-3 text-sm leading-6 text-gray-400">{system.description}</p>
              <p className="mt-3 text-sm leading-6 text-[#f0deb0]">{system.emotionalLine}</p>
              <p className="mt-4 text-sm font-medium text-[#f4d47a]">Explore this system</p>
            </Link>
          ))}
        </div>

        <section className="grid gap-5 md:grid-cols-3">
          {products.slice(0, 3).map((item) => <ProductCard key={item.id} item={item} />)}
        </section>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
      </section>

      <section className="rounded-2xl border border-[#d4af37]/20 bg-[#10110f] p-4 md:p-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[#d4af37]">Trending Now</h3>
          <span className="text-xs text-gray-400">Live buyer signals</span>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-1">
          {trending.map((item) => (
            <article key={item.title} className="min-w-[250px] max-w-[250px] overflow-hidden rounded-xl border border-white/10 bg-[#0b0c0a]">
              <img src={item.image} alt={item.title} className="h-32 w-full object-cover" />
              <div className="p-3">
                <span className="rounded-full border border-[#d4af37]/25 bg-[#d4af37]/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-[#f4d47a]">
                  {item.tag === 'High demand'
                    ? 'High demand'
                    : item.tag === 'Seasonal harvest'
                      ? 'Seasonal'
                      : item.tag === 'Conservation project'
                        ? 'Conservation'
                        : 'Community'}
                </span>
                <p className="text-sm font-semibold text-white">{item.title}</p>
                <p className="mt-1 text-xs text-[#d4af37]">{item.metric}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-[#d4af37]">Participate</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">Different entry points for buyers, institutions, and long-term funders</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-400">
            This marketplace serves household buyers, procurement teams, and capital partners differently, while keeping the same community-first economic logic.
          </p>
        </div>

      <section className="grid gap-5 md:grid-cols-3">
        <article className="rounded-xl border border-[#d4af37]/20 bg-[#10110f] p-4">
          <p className="text-xs uppercase tracking-wide text-[#d4af37]">For household buyers</p>
          <p className="mt-2 text-lg font-semibold text-white">Shop seasonal harvests</p>
          <p className="mt-2 text-sm leading-6 text-gray-300">Buy foods, seeds, and natural materials with origin visibility, seasonal rhythm, and stewardship built into the transaction.</p>
          <Link href="/land-food/marketplace" className="mt-3 inline-block text-sm text-[#d4af37] hover:underline">Start shopping</Link>
        </article>
        <article className="rounded-xl border border-[#d4af37]/20 bg-[#10110f] p-4">
          <p className="text-xs uppercase tracking-wide text-[#d4af37]">For procurement teams</p>
          <p className="mt-2 text-lg font-semibold text-white">Source directly from producers</p>
          <p className="mt-2 text-sm leading-6 text-gray-300">Access wholesale-ready supply, documentation, and relationship-first procurement for schools, food programs, and cultural institutions.</p>
          <Link href="/land-food/wholesale-inquiry" className="mt-3 inline-block text-sm text-[#d4af37] hover:underline">Request wholesale</Link>
        </article>
        <article className="rounded-xl border border-[#d4af37]/20 bg-[#10110f] p-4">
          <p className="text-xs uppercase tracking-wide text-[#d4af37]">For long-term funders</p>
          <p className="mt-2 text-lg font-semibold text-white">Fund stewardship and restoration</p>
          <p className="mt-2 text-sm leading-6 text-gray-300">Back regenerative projects with clearer stewardship percentages, outcome logic, and direct visibility into community benefit.</p>
          <Link href="/land-food/services/conservation-carbon-projects" className="mt-3 inline-block text-sm text-[#d4af37] hover:underline">Fund projects</Link>
        </article>
      </section>

        <section className="grid gap-5 md:grid-cols-3">
          {producers.map((item) => <ProducerCard key={item.id} item={item} />)}
        </section>
      </section>

      <section className="space-y-5">
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-[#d4af37]">Impact</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">Projects, stewardship revenue, and restorative outcomes tied to every layer</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-400">
            Capital on this page does more than move product. It can restore wetlands, protect seed systems, and keep regenerative work resourced over time.
          </p>
        </div>

        <section className="grid gap-5 md:grid-cols-2">
          {projects.map((item) => <ProjectCard key={item.id} item={item} />)}
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <article className="rounded-xl border border-[#d4af37]/20 bg-[#10110f] p-4">
            <p className="text-xs uppercase tracking-wide text-[#d4af37]">Hectares restored</p>
            <p className="mt-2 text-2xl font-semibold text-white">2,840</p>
            <p className="mt-1 text-sm text-gray-400">Across wetland, forest, and dryland restoration programs.</p>
          </article>
          <article className="rounded-xl border border-[#d4af37]/20 bg-[#10110f] p-4">
            <p className="text-xs uppercase tracking-wide text-[#d4af37]">Communities supported</p>
            <p className="mt-2 text-2xl font-semibold text-white">19</p>
            <p className="mt-1 text-sm text-gray-400">Participating through producer networks, stewardship teams, and seed systems.</p>
          </article>
          <article className="rounded-xl border border-[#d4af37]/20 bg-[#10110f] p-4">
            <p className="text-xs uppercase tracking-wide text-[#d4af37]">Biodiversity score</p>
            <p className="mt-2 text-2xl font-semibold text-white">93 avg</p>
            <p className="mt-1 text-sm text-gray-400">Measured across listed regenerative projects and habitat restoration outcomes.</p>
          </article>
        </section>

        <RegenerativeImpactBand />
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        {rankedCommunities.map((community, idx) => (
          <article key={community.name} className="rounded-xl border border-[#d4af37]/20 bg-[#10110f] p-4">
            <p className="text-xs uppercase tracking-wide text-[#d4af37]">Rank #{idx + 1}</p>
            <p className="mt-1 text-base font-semibold text-white">{community.name}</p>
            <p className="mt-1 text-xs text-gray-400">{community.label}</p>
            <p className="mt-2 text-sm text-[#d4af37]">Community Score: {community.score}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.3fr,1fr]">
        <article className="overflow-hidden rounded-2xl border border-[#d4af37]/14 bg-[#0f100e]">
          <img
            src="https://images.unsplash.com/photo-1465379944081-7f47de8d74ac?w=1600&h=900&fit=crop"
            alt="Land and food story"
            className="h-56 w-full object-cover"
          />
          <div className="space-y-3 p-5">
            <p className="text-xs uppercase tracking-wider text-[#c9a642]">What Pillar 8 Is</p>
            <h3 className="text-lg font-semibold text-white">A regenerative commerce layer for land, food, and stewardship</h3>
            <p className="text-sm text-gray-400">
              Pillar 8 combines product sales, seed systems, ecological services, and conservation finance so communities can earn from
              protecting biodiversity and traditional food systems.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-white/15 px-2.5 py-1 text-xs text-gray-300">Products + Services</span>
              <span className="rounded-full border border-white/15 px-2.5 py-1 text-xs text-gray-300">Verified Origins</span>
              <span className="rounded-full border border-white/15 px-2.5 py-1 text-xs text-gray-300">Direct Community Revenue</span>
            </div>
          </div>
        </article>
        <article className="rounded-2xl border border-[#d4af37]/20 bg-[#10110f] p-5">
          <p className="text-xs uppercase tracking-wider text-[#d4af37]">How It Works</p>
          <div className="mt-3 space-y-3 text-sm text-gray-300">
            <div className="rounded-lg border border-white/10 bg-black/25 p-3">1. Discover verified producers, products, and stewardship services.</div>
            <div className="rounded-lg border border-white/10 bg-black/25 p-3">2. Check harvest windows, traceability, and protocol notes.</div>
            <div className="rounded-lg border border-white/10 bg-black/25 p-3">3. Purchase, contract, or co-fund projects with direct community payout.</div>
            <div className="rounded-lg border border-white/10 bg-black/25 p-3">4. Track seasonal supply, impact outcomes, and reorder cycles.</div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/land-food/marketplace" className="rounded-full bg-[#d4af37] px-4 py-2 text-sm font-semibold text-black hover:bg-[#f4d370]">Start Exploring</Link>
            <Link href="/land-food/harvest-calendar" className="rounded-full border border-[#d4af37]/35 px-4 py-2 text-sm text-[#d4af37] hover:bg-[#d4af37]/10">See Seasonal Supply</Link>
          </div>
        </article>
      </section>

      <section className="rounded-[30px] border border-[#d4af37]/20 bg-[linear-gradient(135deg,rgba(18,18,14,0.98),rgba(10,10,9,0.98))] p-6 md:p-7">
        <p className="text-[11px] uppercase tracking-[0.28em] text-[#d4af37]">Participate in a living food system</p>
        <h3 className="mt-3 text-3xl font-semibold text-white">Participate in a living food system.</h3>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-300">
          Shop seasonal foods, source wholesale with confidence, or fund regenerative work that protects land and food sovereignty over the long term.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          {[
            ['/land-food/marketplace', 'Shop seasonal harvests'],
            ['/land-food/wholesale-inquiry', 'Source wholesale'],
            ['/land-food/services/conservation-carbon-projects', 'Fund stewardship']
          ].map(([href, label], index) => (
            <Link
              key={href}
              href={href}
              className={index === 0 ? 'rounded-full bg-[#d4af37] px-5 py-3 text-sm font-semibold text-black hover:bg-[#f4d370]' : 'rounded-full border border-[#d4af37]/35 px-5 py-3 text-sm font-medium text-[#d4af37] hover:bg-[#d4af37]/10'}
            >
              {label}
            </Link>
          ))}
        </div>
      </section>
    </LandFoodFrame>
  );
}
