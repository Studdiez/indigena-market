'use client';

import Link from 'next/link';
import {
  AudioLines,
  ArrowRight,
  MapPinned,
  Mic2,
  GraduationCap,
  HeartHandshake
} from 'lucide-react';
import LanguageHeritageFrame from './components/LanguageHeritageFrame';
import HeritageCardGrid from './components/HeritageCardGrid';
import HeritageLiveListings from './components/HeritageLiveListings';
import AnimatedCounter from './components/AnimatedCounter';

const whyThisMatters = [
  {
    title: 'Languages carry identity and knowledge',
    description: 'Every recording, lesson, and story path protects a living relationship between people, memory, place, and ceremony.'
  },
  {
    title: 'Preservation requires active participation',
    description: 'Language survives when learners, keepers, educators, and communities are supported to teach, record, and practice together.'
  },
  {
    title: 'Communities retain control and benefit',
    description: 'Protocol-aware access and community-led stewardship keep value, authorship, and decision-making with knowledge holders.'
  }
];

const guidedPaths = [
  {
    title: 'Beginner path',
    description: 'Start with family phrases, pronunciation support, and welcoming learning packs that make the first steps feel possible.',
    href: '/language-heritage/learning-materials',
    cta: 'Start learning',
    icon: GraduationCap
  },
  {
    title: 'Cultural immersion',
    description: 'Move through guided sessions, live circles, and hosted experiences where language is carried through context, not just translation.',
    href: '/language-heritage/marketplace',
    cta: 'Explore sessions',
    icon: Mic2
  },
  {
    title: 'Storytelling & oral tradition',
    description: 'Enter recordings, archives, and story bundles that preserve voice, cadence, and intergenerational teaching.',
    href: '/language-heritage/archive',
    cta: 'Open the archive',
    icon: AudioLines
  }
];

const liveNow = [
  {
    title: 'Lakota Story Circle',
    label: 'Live session',
    stat: '28 learners joined today'
  },
  {
    title: 'Cree keyboard bundle',
    label: 'New upload',
    stat: '74 saves this week'
  },
  {
    title: 'Maori immersion retreat',
    label: 'Filling quickly',
    stat: '6 seats remaining'
  }
];

const languageJourneys = [
  {
    name: 'Navajo',
    region: 'Dine Bikeyah',
    description: 'Family phrase sets, classroom tools, and guided learning packs that carry language into daily life.',
    href: '/language-heritage/languages'
  },
  {
    name: 'Lakota',
    region: 'Oceti Sakowin homelands',
    description: 'Story circles, oral teaching, and live sessions rooted in community-held protocol and presence.',
    href: '/language-heritage/languages'
  },
  {
    name: 'Maori',
    region: 'Aotearoa',
    description: 'Immersion pathways, waiata archives, and cultural learning designed to keep language active and shared.',
    href: '/language-heritage/languages'
  },
  {
    name: 'Inuit',
    region: 'Inuit Nunangat',
    description: 'Seasonal lexicons, recordings, and learning tools grounded in place, memory, and intergenerational use.',
    href: '/language-heritage/languages'
  }
];

const keepers = [
  {
    name: 'Elder Maria Begay',
    nation: 'Dine',
    role: 'Elder • Story & Protocol Keeper',
    image: 'https://images.unsplash.com/photo-1546961329-78bef0414d7c?w=900&h=900&fit=crop'
  },
  {
    name: 'James Yazzie',
    nation: 'Navajo Nation',
    role: 'Top contributor • Language Documentation Lead',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&h=900&fit=crop'
  },
  {
    name: 'Aroha Rangi',
    nation: 'Maori',
    role: 'Language keeper • Immersion Program Mentor',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=900&h=900&fit=crop'
  }
];

const contributionImpact = [
  'Fund language documentation and archival stewardship',
  'Support community educators and immersion mentors',
  'Preserve oral traditions, recordings, and story collections'
];

export default function LanguageHeritageHomePage() {
  return (
    <LanguageHeritageFrame
      title="Language & Heritage"
      subtitle="Keepers of the world's oldest stories. Document, learn, preserve, and protect."
      showPageHeader={false}
      showStickyBanner={false}
      showPremiumHero={false}
    >
      <section className="overflow-hidden rounded-[30px] border border-[#d4af37]/20 bg-[linear-gradient(135deg,rgba(26,18,10,0.96),rgba(10,10,10,0.98))] shadow-[0_18px_60px_rgba(0,0,0,0.32)]">
        <div className="grid gap-6 px-6 py-7 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:py-8">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-[#d4af37]">Living language economy</p>
            <h1 className="mt-3 max-w-4xl text-3xl font-semibold leading-tight text-white lg:text-5xl">
              Preserve, learn, and carry the world&apos;s oldest living languages.
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-gray-300">
              Access archives, learn from knowledge keepers, and support community-led language preservation through recordings, learning packs, live sessions, and living cultural systems.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/language-heritage/learning-materials"
                className="rounded-full bg-[#d4af37] px-5 py-3 text-sm font-semibold text-black transition-colors hover:bg-[#f4e4a6]"
              >
                Start Learning
              </Link>
              <Link
                href="/launchpad"
                className="rounded-full border border-[#d4af37]/25 bg-black/20 px-5 py-3 text-sm font-semibold text-[#f4d47a] transition-colors hover:border-[#d4af37]/45 hover:bg-[#d4af37]/10"
              >
                Support Preservation
              </Link>
              <Link
                href="/language-heritage/contributor-dashboard"
                className="rounded-full border border-white/15 bg-black/20 px-5 py-3 text-sm font-semibold text-white transition-colors hover:border-[#d4af37]/25 hover:text-[#f4d47a]"
              >
                Become a Contributor
              </Link>
            </div>

            <div className="mt-7 rounded-3xl border border-[#d4af37]/18 bg-black/20 p-5">
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
          </div>

          <div className="space-y-4">
            <div className="overflow-hidden rounded-[26px] border border-[#d4af37]/20 bg-[#141414]">
              <div className="relative h-56">
                <img
                  src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1400&h=700&fit=crop"
                  alt="Language and heritage community session"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-[#d4af37] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-black">
                    Featured Learning Pack
                  </span>
                  <span className="rounded-full border border-[#d4af37]/25 bg-black/60 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#f4d47a]">
                    Community Spotlight
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h2 className="text-xl font-semibold text-white">Navajo Family Phrase Set</h2>
                <p className="mt-2 text-sm leading-6 text-gray-300">
                  A guided language pack designed for families, teachers, and community learners carrying everyday language into active use.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-emerald-300">
                    423 learners this week
                  </span>
                  <span className="rounded-full border border-[#d4af37]/25 bg-[#d4af37]/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-[#f4d47a]">
                    Joined by 28 learners today
                  </span>
                </div>
                <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-[#d4af37]">Why learners start here</p>
                    <p className="mt-1 text-sm text-gray-300">Warm entry point for families, classrooms, and first-time learners carrying language into everyday use.</p>
                  </div>
                  <Link href="/language-heritage/learning-materials" className="shrink-0 text-sm font-medium text-[#f4d47a] transition-colors hover:text-white">
                    Open pack
                  </Link>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {liveNow.slice(0, 2).map((item) => (
                <article key={item.title} className="rounded-2xl border border-white/10 bg-[#111111]/80 p-4">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-[#d4af37]">{item.label}</p>
                  <p className="mt-3 text-sm font-semibold text-white">{item.title}</p>
                  <p className="mt-2 text-sm leading-6 text-gray-400">{item.stat}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        {[
          { label: 'Languages being supported', value: 247, suffix: '+' },
          { label: 'Archive items stewarded', value: 1200000, compact: true },
          { label: 'Active learners this season', value: 18000, compact: true, suffix: '+' },
          { label: 'Contributors and educators', value: 15000, compact: true, suffix: '+' }
        ].map((metric, idx) => (
          <div key={metric.label} className="fade-up-in rounded-2xl border border-[#d4af37]/20 bg-[#101010] p-5" style={{ animationDelay: `${idx * 70}ms` }}>
            <p className="text-xs uppercase tracking-wide text-gray-400">{metric.label}</p>
            <p className="mt-2 text-2xl font-semibold text-white">
              <AnimatedCounter value={metric.value} compact={Boolean(metric.compact)} suffix={metric.suffix || ''} />
            </p>
          </div>
        ))}
      </section>

      <section className="rounded-[28px] border border-[#d4af37]/18 bg-[linear-gradient(135deg,rgba(24,18,5,0.96),rgba(10,10,10,0.98))] p-6 md:p-7">
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-[#d4af37]">Start your language journey</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">Guided paths into language, story, and living knowledge</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-400">
              Choose a path based on where you are starting, not just what category you are browsing.
            </p>
          </div>
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {guidedPaths.map((path) => (
            <Link
              key={path.title}
              href={path.href}
              className="overflow-hidden rounded-2xl border border-white/10 bg-[#141414]/90 p-6 transition-all hover:-translate-y-1 hover:border-[#d4af37]/35"
            >
              <div className="flex items-center gap-2 text-[#d4af37]">
                <path.icon size={16} />
                <p className="text-[11px] uppercase tracking-[0.24em]">{path.title}</p>
              </div>
              <p className="mt-4 text-lg font-semibold text-white">{path.title}</p>
              <p className="mt-2 text-sm leading-6 text-gray-400">{path.description}</p>
              <p className="mt-4 text-sm font-medium text-[#f4d47a]">{path.cta}</p>
            </Link>
          ))}
        </div>
      </section>

      <HeritageLiveListings title="Live Now" query={{ sort: 'featured' }} />

      <section className="rounded-[28px] border border-[#d4af37]/18 bg-[linear-gradient(135deg,rgba(18,18,18,0.98),rgba(9,9,9,0.98))] p-6 md:p-7">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-[#d4af37]">Explore by language / nation</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">Follow language through people, place, and community stewardship</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-400">
              Start from identity as well as format. Move through languages and Nations with clearer cultural context, living archives, and community-led learning.
            </p>
          </div>
          <Link href="/language-heritage/languages" className="inline-flex items-center gap-2 text-sm font-medium text-[#f4d47a] transition-colors hover:text-white">
            Browse all languages
            <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid gap-5 lg:grid-cols-4">
          {languageJourneys.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="rounded-2xl border border-white/10 bg-[#111111]/85 p-5 transition-all hover:-translate-y-1 hover:border-[#d4af37]/35"
            >
              <div className="flex items-center gap-2 text-[#d4af37]">
                <MapPinned size={15} />
                <p className="text-[11px] uppercase tracking-[0.24em]">{item.region}</p>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-white">{item.name}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-400">{item.description}</p>
              <p className="mt-4 text-sm font-medium text-[#f4d47a]">Explore learning and archive access</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="fade-up-in overflow-hidden rounded-2xl border border-[#d4af37]/20 bg-[#101010]">
          <img
            src="https://images.unsplash.com/photo-1524492412937-b28074a5d7c?w=1600&h=900&fit=crop"
            alt="Language preservation on Country"
            className="h-56 w-full object-cover"
          />
          <div className="space-y-4 p-5">
            <p className="text-xs uppercase tracking-wide text-[#d4af37]">A living language economy</p>
            <h3 className="text-2xl font-semibold text-white">A living archive, learning platform, and cultural economy in one system</h3>
            <p className="text-sm leading-7 text-gray-300">
              Language & Heritage is where archives, courses, recordings, dictionaries, and community knowledge systems stay active. Contributors earn, learners participate, and communities retain stewardship over access and value.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="rounded-full border border-white/20 px-2.5 py-1 text-xs text-gray-200">Community-controlled</span>
              <span className="rounded-full border border-white/20 px-2.5 py-1 text-xs text-gray-200">ICIP-aware</span>
              <span className="rounded-full border border-white/20 px-2.5 py-1 text-xs text-gray-200">Protocol-first</span>
            </div>
            <div className="rounded-2xl border border-[#d4af37]/20 bg-black/20 p-4">
              <p className="text-[11px] uppercase tracking-[0.24em] text-[#d4af37]">Your support helps</p>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-300">
                {contributionImpact.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <HeartHandshake size={16} className="mt-1 text-[#d4af37]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
          {keepers.map((keeper, idx) => (
            <article
              key={keeper.name}
              className="fade-up-in flex items-center gap-3 rounded-xl border border-[#d4af37]/20 bg-[#101010] p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#d4af37]/35"
              style={{ animationDelay: `${idx * 90}ms` }}
            >
              <img src={keeper.image} alt={keeper.name} className="h-16 w-16 rounded-full object-cover" />
              <div>
                <p className="text-sm font-semibold text-white">{keeper.name}</p>
                <p className="text-xs text-gray-400">{keeper.nation}</p>
                <p className="text-xs text-[#d4af37]">{keeper.role}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-[#d4af37]/20 bg-[#101010] p-4 md:p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[#d4af37]">Trending now</h3>
          <span className="text-xs text-gray-400">Live discovery and premium visibility</span>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-1">
          {[
            {
              title: 'Lakota Story Circle Live',
              type: 'Live session',
              image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&h=700&fit=crop',
              stat: '+220 watching'
            },
            {
              title: 'Navajo Family Phrase Set',
              type: 'Learning pack',
              image: 'https://images.unsplash.com/photo-1491841573634-28140fc7ced7?w=1200&h=700&fit=crop',
              stat: '+420 saves'
            },
            {
              title: 'Yolngu Song Archive Drop',
              type: 'Audio archive',
              image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1200&h=700&fit=crop',
              stat: '+160 purchases'
            },
            {
              title: 'Inuit Winter Lexicon',
              type: 'Dictionary',
              image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1200&h=700&fit=crop',
              stat: '+95 reviews'
            }
          ].map((item, idx) => (
            <article
              key={item.title}
              className="fade-up-in group min-w-[260px] max-w-[260px] overflow-hidden rounded-xl border border-white/10 bg-[#0b0b0b] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#d4af37]/35"
              style={{ animationDelay: `${idx * 70}ms` }}
            >
              <div className="relative h-32">
                <img src={item.image} alt={item.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                <span className="absolute left-2 top-2 rounded-full border border-[#d4af37]/35 bg-black/60 px-2 py-0.5 text-[10px] uppercase tracking-wide text-[#d4af37]">
                  {item.type}
                </span>
              </div>
              <div className="p-3">
                <p className="line-clamp-2 text-sm font-semibold text-white">{item.title}</p>
                <p className="mt-1 text-xs text-[#d4af37]">{item.stat}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <HeritageCardGrid
        title="Explore the living archive"
        items={[
          {
            title: 'Language Learning',
            href: '/language-heritage/learning-materials',
            badge: 'Education',
            meta: 'Courses, packs, and tools built for active learners.'
          },
          {
            title: 'Audio & Video',
            href: '/language-heritage/audio-video',
            badge: 'Media',
            meta: 'Recordings, performances, and oral history in living formats.'
          },
          {
            title: 'Apps & Tools',
            href: '/language-heritage/apps-tools',
            badge: 'Technology',
            meta: 'Keyboards, software, and digital access tools for language use.'
          },
          {
            title: 'Books',
            href: '/language-heritage/books-publications',
            badge: 'Publishing',
            meta: 'Readers, workbooks, and story collections for home and classroom.'
          },
          {
            title: 'Digital Archive',
            href: '/language-heritage/archive',
            badge: 'Archive',
            meta: 'Protocol-aware access to preserved recordings and collections.'
          },
          {
            title: 'Sacred Portal',
            href: '/language-heritage/sacred',
            badge: 'Protected',
            meta: 'Access-managed cultural materials requiring community review.'
          },
          {
            title: 'Knowledge Systems',
            href: '/language-heritage/knowledge-systems',
            badge: 'Knowledge',
            meta: 'Ecology, place names, story systems, and living heritage frameworks.'
          },
          {
            title: 'Repatriation Hub',
            href: '/language-heritage/repatriation',
            badge: 'Restitution',
            meta: 'Support language return, archival repair, and cultural stewardship.'
          }
        ]}
      />

      <HeritageLiveListings title="Start Here" query={{ sort: 'featured' }} />

      <section className="grid gap-4 md:grid-cols-3">
        {[
          { title: 'Arapaho Community Archive', value: '87% funded', image: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1200&h=700&fit=crop' },
          { title: 'Ainu Storytelling Recovery', value: '62% funded', image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&h=700&fit=crop' },
          { title: 'Inuit Youth Recording Lab', value: '54% funded', image: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=1200&h=700&fit=crop' }
        ].map((project, idx) => (
          <article key={project.title} className="fade-up-in overflow-hidden rounded-xl border border-[#d4af37]/20 bg-[#101010]" style={{ animationDelay: `${idx * 80}ms` }}>
            <img src={project.image} alt={project.title} className="h-36 w-full object-cover" />
            <div className="p-4">
              <p className="text-sm font-semibold text-white">{project.title}</p>
              <p className="mt-1 text-xs text-[#d4af37]">{project.value}</p>
              <button type="button" className="mt-3 rounded-full border border-[#d4af37]/40 px-3 py-1 text-xs text-[#d4af37] hover:bg-[#d4af37]/10">
                Support Project
              </button>
            </div>
          </article>
        ))}
      </section>

      <section className="rounded-[28px] border border-[#d4af37]/18 bg-[linear-gradient(135deg,rgba(24,18,5,0.96),rgba(10,10,10,0.98))] p-6 md:p-7">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-[#d4af37]">Carry a language forward</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Carry a language forward.</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-400">
              Learn, preserve, and contribute inside a system where language remains alive, community-led, and economically supported.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/language-heritage/learning-materials" className="rounded-full bg-[#d4af37] px-5 py-3 text-sm font-semibold text-black transition-colors hover:bg-[#f4e4a6]">
              Start Learning
            </Link>
            <Link href="/launchpad" className="rounded-full border border-[#d4af37]/25 bg-black/20 px-5 py-3 text-sm font-semibold text-[#f4d47a] transition-colors hover:border-[#d4af37]/45 hover:bg-[#d4af37]/10">
              Support Preservation
            </Link>
            <Link href="/language-heritage/contributor-dashboard" className="rounded-full border border-white/15 bg-black/20 px-5 py-3 text-sm font-semibold text-white transition-colors hover:border-[#d4af37]/25 hover:text-[#f4d47a]">
              Become a Contributor
            </Link>
          </div>
        </div>
      </section>
    </LanguageHeritageFrame>
  );
}
