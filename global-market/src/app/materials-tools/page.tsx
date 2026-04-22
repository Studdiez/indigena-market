import Link from 'next/link';
import MaterialsToolsFrame from './components/MaterialsToolsFrame';
import MaterialsToolsHero from './components/MaterialsToolsHero';
import {
  StatsStrip,
  SupplyChainBand,
  SampleListings,
  SupplierShowcase,
  ToolLibraryShowcase,
  ServiceShowcase,
  CoopShowcase
} from './components/MaterialsToolsCards';
import { categoryMeta, products, rentals, services, suppliers } from './data/pillar10Data';

const whyThisMatters = [
  {
    title: 'Tools shape how culture is preserved',
    description: 'The right recording kits, carving tools, keyboards, and material systems determine what communities can keep active and pass forward.'
  },
  {
    title: 'Access to materials sustains craft',
    description: 'When creators can source traceable fibres, pigments, hides, and equipment with confidence, cultural production becomes more resilient.'
  },
  {
    title: 'Control over tools is part of sovereignty',
    description: 'Owning the supply layer means communities can create, document, teach, and build without depending entirely on outside systems.'
  }
];

const pillarCategories = [
  {
    title: 'Art & Craft Materials',
    description: 'Pigments, fibres, hides, beads, carving materials, and culturally grounded maker inputs.',
    href: '/materials-tools/marketplace'
  },
  {
    title: 'Language & Documentation Tools',
    description: 'Capture kits, keyboards, storage tools, and systems used to record, preserve, and share knowledge responsibly.',
    href: '/language-heritage/apps-tools'
  },
  {
    title: 'Audio & Recording Equipment',
    description: 'Shared studio gear, rental equipment, and creator infrastructure for story, music, teaching, and documentation.',
    href: '/materials-tools/rentals'
  },
  {
    title: 'Cultural Teaching Kits',
    description: 'Materials and starter sets designed for community education, intergenerational practice, and cultural continuity.',
    href: '/materials-tools/marketplace'
  },
  {
    title: 'Digital Creator Tools',
    description: 'Tablets, capture gear, publishing infrastructure, and digital studio systems for contemporary Indigenous creators.',
    href: '/materials-tools/categories/digital-equipment'
  }
];

const creatorPaths = [
  {
    title: 'For Artists',
    description: 'Source verified materials, studio tools, and finishing supplies that support visual, textile, carving, and regalia practices.',
    href: '/materials-tools/marketplace',
    cta: 'Browse maker inputs'
  },
  {
    title: 'For Language Keepers',
    description: 'Equip documentation, recording, and learning work with the capture tools and digital infrastructure preservation depends on.',
    href: '/materials-tools/rentals',
    cta: 'Explore recording gear'
  },
  {
    title: 'For Educators',
    description: 'Build teaching environments with starter kits, classroom-ready materials, and practical tools for active cultural learning.',
    href: '/materials-tools/bulk-coop',
    cta: 'Open education supply'
  },
  {
    title: 'For Communities',
    description: 'Use co-op buying, supplier networks, and tool libraries to equip broader systems without carrying every cost alone.',
    href: '/materials-tools/suppliers',
    cta: 'See supplier networks'
  }
];

const liveUse = [
  {
    title: 'Story Recording Kit in use',
    description: 'Community media teams are using shared audio gear to document oral histories and language lessons this month.',
    signal: '4 active documentation builds',
    href: '/materials-tools/rentals'
  },
  {
    title: 'Natural Dye Bundles in practice',
    description: 'Textile artists are working with plant-based dye sets and fibre bundles linked to harvest stories and protocol notes.',
    signal: '12 studio orders this week',
    href: '/materials-tools/marketplace'
  },
  {
    title: 'Tool libraries supporting workshops',
    description: 'Shared carving, capture, and studio equipment is being booked through community hubs instead of sitting behind purchase barriers.',
    signal: 'Next booking windows open',
    href: '/materials-tools/rentals'
  }
];

const creatorKits = [
  {
    title: 'Storytelling Kit',
    description: 'Recorder, mic, storage, and field-ready accessories for oral history, interviews, and community media.',
    href: '/materials-tools/rentals',
    badge: 'Featured Tool'
  },
  {
    title: 'Language Documentation Kit',
    description: 'Capture hardware, keyboard-ready devices, and preservation tools for active language work and archive building.',
    href: '/language-heritage/apps-tools',
    badge: 'Sponsored Kit'
  },
  {
    title: 'Artisan Starter Kit',
    description: 'Core maker materials, surfaces, and small studio tools for artists building or expanding a sovereign practice.',
    href: '/materials-tools/marketplace',
    badge: 'Creator Infrastructure'
  }
];

const toolHighlights = [
  {
    title: 'Indigenous Language Keyboard',
    description: 'Digital typing and orthography support for language work, publishing, and community communication.',
    href: '/language-heritage/apps-tools'
  },
  {
    title: 'Story Recording Kit',
    description: 'Shared audio capture equipment for interviews, oral tradition, and education sessions.',
    href: '/materials-tools/rentals'
  },
  {
    title: 'Natural Dye Bundle',
    description: 'Traceable pigments and fibre-ready dye materials linked to harvest story and stewardship context.',
    href: '/materials-tools/marketplace'
  },
  {
    title: 'Beadwork Starter Set',
    description: 'Starter materials and findings for regalia, jewelry, and craft practice with reliable sourcing.',
    href: '/materials-tools/marketplace'
  }
];

export default function MaterialsToolsHomePage() {
  const supplySignals = [
    { label: 'Verified supplier networks', value: `${suppliers.length}+` },
    { label: 'Featured tools and materials', value: `${products.length}+` },
    { label: 'Shared equipment hubs', value: `${rentals.length}` },
    { label: 'Creator service routes', value: `${services.length}` }
  ];

  return (
    <MaterialsToolsFrame
      title="Materials & Tools"
      subtitle="Infrastructure layer for verified materials, creator tools, and the systems that support Indigenous production."
    >
      <MaterialsToolsHero
        eyebrow="Pillar 10"
        title="Build, create, and preserve with Indigenous materials and tools."
        description="Access verified materials, digital tools, and creator kits used across art, language, food, and cultural systems."
        emotionalLine="Tools carry knowledge. How we build shapes how culture is preserved, shared, and kept in community hands."
        image="https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1800&h=900&fit=crop"
        chips={['Verified Supplier Badge', 'Creator Kits', 'Tool Library Access']}
        premiumLabel="Infrastructure Layer"
        actions={[
          { href: '/materials-tools/marketplace', label: 'Browse Materials' },
          { href: '/materials-tools/rentals', label: 'Explore Tools', tone: 'secondary' },
          { href: '/materials-tools/suppliers', label: 'Equip Your Practice', tone: 'secondary' }
        ]}
      />

      <section className="rounded-[28px] border border-[#9b6b2b]/25 bg-[linear-gradient(135deg,rgba(18,13,9,0.98),rgba(11,11,11,0.98))] p-5 md:p-6">
        <p className="text-xs uppercase tracking-[0.3em] text-[#d4af37]">Why this matters</p>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {whyThisMatters.map((item) => (
            <article key={item.title} className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-sm font-semibold text-white">{item.title}</p>
              <p className="mt-2 text-sm leading-6 text-[#d5cab8]">{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <StatsStrip />

      <section className="space-y-5">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[#d4af37]">Tool categories</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">The toolkit behind Indigenous creativity, preservation, and production</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[#d5cab8]">
            This pillar exists to equip work across the ecosystem, from studio practice and language documentation to teaching, ceremony-adjacent care, and community infrastructure.
          </p>
        </div>
        <div className="grid gap-5 lg:grid-cols-5">
          {pillarCategories.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="rounded-2xl border border-[#9b6b2b]/25 bg-[#100d09] p-5 transition-all hover:-translate-y-1 hover:border-[#d4af37]/35"
            >
              <h3 className="text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#d5cab8]">{item.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[#d4af37]">Featured tools</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">Core tools and materials creators reach for first</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {toolHighlights.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="rounded-2xl border border-[#9b6b2b]/25 bg-[#100d09] p-5 transition-all hover:-translate-y-0.5 hover:border-[#d4af37]/35"
            >
              <p className="text-[11px] uppercase tracking-[0.24em] text-[#8fd7dc]">Featured tool</p>
              <h3 className="mt-3 text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#d5cab8]">{item.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[#d4af37]">Browse rooted supply</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">Materials and tools with origin, trust, and real practice context</h2>
        </div>
        <SampleListings />
      </section>

      <section className="space-y-5">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[#d4af37]">Built for creators & communities</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">Different infrastructure for different kinds of work</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {creatorPaths.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="rounded-2xl border border-[#9b6b2b]/25 bg-[#100d09] p-5 transition-all hover:-translate-y-0.5 hover:border-[#d4af37]/35"
            >
              <p className="text-[11px] uppercase tracking-[0.24em] text-[#d4af37]">{item.title}</p>
              <p className="mt-3 text-sm leading-7 text-[#d5cab8]">{item.description}</p>
              <p className="mt-4 text-sm font-medium text-[#9fe5ea]">{item.cta}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-[28px] border border-[#1d6b74]/25 bg-[#0d1314] p-6 md:p-7">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#8fd7dc]">Tools in real use</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">See how materials and gear move through real cultural and creative work</h2>
          </div>
          <div className="rounded-full border border-[#1d6b74]/35 bg-black/20 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-[#9fe5ea]">
            Active builds
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {liveUse.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="rounded-2xl border border-white/10 bg-black/20 p-5 transition-all hover:-translate-y-0.5 hover:border-[#8fd7dc]/35"
            >
              <p className="text-lg font-semibold text-white">{item.title}</p>
              <p className="mt-3 text-sm leading-6 text-[#d7f0f2]">{item.description}</p>
              <p className="mt-3 text-xs uppercase tracking-[0.2em] text-[#b6e7ea]">Used in live workshops, documentation runs, and studio prep</p>
              <p className="mt-4 text-sm font-medium text-[#8fd7dc]">{item.signal}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[#d4af37]">Creator kits</p>
          <h2 className="mt-2 text-[2rem] font-semibold text-white">Premium creator kits that help practices get moving faster</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[#d5cab8]">
            These are not generic bundles. They are practical starting systems for storytelling, documentation, and studio work, shaped around how Indigenous creators and communities actually operate.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {creatorKits.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="rounded-[26px] border border-[#9b6b2b]/25 bg-[linear-gradient(180deg,rgba(29,21,12,0.98),rgba(16,13,9,0.98))] p-6 transition-all hover:-translate-y-1 hover:border-[#d4af37]/35"
            >
              <span className="rounded-full border border-[#d4af37]/30 bg-[#d4af37]/10 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-[#f2cb7d]">
                {item.badge}
              </span>
              <h3 className="mt-4 text-xl font-semibold text-white">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#d5cab8]">{item.description}</p>
              <p className="mt-4 text-sm font-medium text-[#9fe5ea]">Open kit details</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[#d4af37]">Verified toolmakers & suppliers</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">The people and collectives supplying the infrastructure behind the work</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[#d5cab8]">
            Trusted suppliers matter here. This ecosystem only works when the makers, collectives, and hubs behind materials and tools are visible, verified, and easy to work with.
          </p>
        </div>
        <SupplierShowcase />
      </section>

      <ToolLibraryShowcase />
      <ServiceShowcase />
      <CoopShowcase />

      <section className="grid gap-4 md:grid-cols-4">
        {supplySignals.map((item) => (
          <article key={item.label} className="rounded-2xl border border-[#9b6b2b]/25 bg-[#100d09] p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-[#bcae99]">{item.label}</p>
            <p className="mt-2 text-2xl font-semibold text-white">{item.value}</p>
          </article>
        ))}
      </section>

      <SupplyChainBand />

      <section className="grid gap-8 lg:grid-cols-[1.15fr,0.85fr]">
        <article className="overflow-hidden rounded-[28px] border border-[#9b6b2b]/15 bg-[#0e0c0a]">
          <img src={categoryMeta['digital-equipment'].image} alt="Creator tools and digital equipment" className="h-60 w-full object-cover" />
          <div className="space-y-3 p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-[#d4af37]">Pillar identity</p>
            <h3 className="text-2xl font-semibold text-white">The infrastructure layer powering every other pillar</h3>
            <p className="text-sm leading-7 text-[#d5cab8]">
              Materials & Tools is where supply, access, and equipment become part of Indigenous sovereignty. It supports art, language, food systems, education, and cultural production by making the toolkit itself visible, trusted, and buyable.
            </p>
          </div>
        </article>

        <article className="rounded-[28px] border border-[#1d6b74]/25 bg-[#0d1314] p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-[#8fd7dc]">How it works</p>
          <div className="mt-4 space-y-3 text-sm text-[#d7f0f2]">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">1. Browse verified materials, tools, kits, and supplier networks by need.</div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">2. Check trust signals, origin, and usage context before buying, renting, or sourcing.</div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">3. Equip artists, educators, language keepers, or community systems with the right infrastructure.</div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">4. Reorder, share, rent, or co-buy inside the Indigenous creator economy.</div>
          </div>
        </article>
      </section>

      <section className="rounded-[30px] border border-[#9b6b2b]/25 bg-[linear-gradient(135deg,rgba(18,13,9,0.98),rgba(11,11,11,0.98))] p-6 md:p-7">
        <p className="text-[11px] uppercase tracking-[0.28em] text-[#d4af37]">Equip your work with tools rooted in culture and community</p>
        <h2 className="mt-3 text-3xl font-semibold text-white">Equip your work with tools rooted in culture and community.</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[#d5cab8]">
          Browse materials, access creator kits, and connect with verified suppliers building the infrastructure behind Indigenous creativity and preservation.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/materials-tools/marketplace" className="rounded-full bg-[#d4af37] px-5 py-3 text-sm font-semibold text-black transition hover:bg-[#f0c96f]">
            Browse Materials
          </Link>
          <Link href="/materials-tools/rentals" className="rounded-full border border-[#9b6b2b]/35 px-5 py-3 text-sm font-medium text-[#e3be83] transition hover:bg-[#9b6b2b]/12">
            Get Creator Kits
          </Link>
          <Link href="/materials-tools/verified-supplier-application" className="rounded-full border border-[#9b6b2b]/35 px-5 py-3 text-sm font-medium text-[#e3be83] transition hover:bg-[#9b6b2b]/12">
            Become a Supplier
          </Link>
        </div>
      </section>
    </MaterialsToolsFrame>
  );
}
