
'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { BadgeCheck, BookOpen, Briefcase, ExternalLink, Layers3, MapPin, MessageSquare, Package, Plane, Sparkles, Star, Sprout, UserPlus, Wrench } from 'lucide-react';
import type { CreatorProfileRecord, ProfileBundle, ProfileFeaturedReview, ProfileOffering, ProfilePillarId, ProfileTrustSignal } from '@/app/profile/data/profileShowcase';
import { getOfferingCtaLabel, getOfferingImage, getOfferingLaunchBadge, getOfferingLeadLabel } from '@/app/profile/lib/offeringMerchandising';
import { StorefrontHeroFrame } from '@/app/components/storefront/StorefrontSurface';
import StorefrontOfferCard from '@/app/components/storefront/StorefrontOfferCard';

export const STOREFRONT_PILLAR_META: Record<Exclude<ProfilePillarId, 'seva'>, { label: string; shortLabel: string; iconNode: ReactNode }> = {
  'digital-arts': { label: 'Digital Art', shortLabel: 'Digital', iconNode: <Sparkles size={15} /> },
  'physical-items': { label: 'Physical Objects', shortLabel: 'Objects', iconNode: <Package size={15} /> },
  courses: { label: 'Courses', shortLabel: 'Courses', iconNode: <BookOpen size={15} /> },
  freelancing: { label: 'Services', shortLabel: 'Services', iconNode: <Briefcase size={15} /> },
  'cultural-tourism': { label: 'Experiences', shortLabel: 'Experiences', iconNode: <Plane size={15} /> },
  'language-heritage': { label: 'Language & Heritage', shortLabel: 'Language', iconNode: <BookOpen size={15} /> },
  'land-food': { label: 'Land & Food', shortLabel: 'Land & Food', iconNode: <Sprout size={15} /> },
  'advocacy-legal': { label: 'Advocacy & Legal', shortLabel: 'Advocacy', iconNode: <BadgeCheck size={15} /> },
  'materials-tools': { label: 'Materials & Tools', shortLabel: 'Materials', iconNode: <Wrench size={15} /> }
};

type OfferClickHandler = (offering: ProfileOffering) => void;

function buildOfferBadges(offering: ProfileOffering, featured = false, spotlight = false) {
  const badges: Array<{ id: string; label: string; className: string }> = [];
  if (featured) badges.push({ id: 'featured', label: 'Featured', className: 'rounded-full border border-[#d4af37]/30 bg-[#d4af37]/10 px-2.5 py-1 text-[11px] text-[#f2d27f]' });
  if (spotlight) badges.push({ id: 'spotlight', label: 'Spotlight', className: 'rounded-full border border-[#8fd7dc]/30 bg-[#8fd7dc]/10 px-2.5 py-1 text-[11px] text-[#b7edf1]' });
  if (offering.featured && !featured) badges.push({ id: 'community-favorite', label: 'Community Favorite', className: 'rounded-full border border-[#d4af37]/25 bg-black/30 px-2.5 py-1 text-[11px] text-[#f4d98c]' });
  if (offering.ctaPreset === 'collect-now') badges.push({ id: 'collector-pick', label: 'Collector Pick', className: 'rounded-full border border-white/15 bg-black/35 px-2.5 py-1 text-[11px] text-white' });
  if (offering.ctaPreset === 'book-now') badges.push({ id: 'bookable', label: 'Bookable', className: 'rounded-full border border-cyan-400/30 bg-cyan-400/10 px-2.5 py-1 text-[11px] text-cyan-100' });
  if (offering.ctaPreset === 'enroll-now') badges.push({ id: 'enrolling', label: 'Enrolling', className: 'rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1 text-[11px] text-emerald-200' });
  if ((offering.availabilityLabel || '').toLowerCase().includes('left')) badges.push({ id: 'limited', label: 'Limited', className: 'rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-1 text-[11px] text-amber-100' });
  const launchBadge = getOfferingLaunchBadge(offering);
  if (launchBadge) badges.push({ id: 'launch', label: launchBadge, className: 'rounded-full border border-[#8fd7dc]/30 bg-[#8fd7dc]/10 px-2.5 py-1 text-[11px] text-[#b7edf1]' });
  return badges.slice(0, 3);
}

function getCreatorRoles(profile: CreatorProfileRecord) {
  const roles = new Set<string>();
  const pillars = new Set(profile.offerings.map((offering) => offering.pillar));
  if (pillars.has('digital-arts')) roles.add('Featured Artist');
  if (pillars.has('courses')) roles.add('Teacher');
  if (pillars.has('cultural-tourism')) roles.add('Host');
  if (pillars.has('freelancing')) roles.add('Consultant');
  if (profile.salesCount >= 250) roles.add('Top Seller');
  return Array.from(roles).slice(0, 4);
}

function getNarrativeLine(profile: CreatorProfileRecord) {
  const pillars = new Set(profile.offerings.map((offering) => offering.pillar));
  if (pillars.has('digital-arts') && pillars.has('courses') && pillars.has('cultural-tourism')) return 'I create visual stories rooted in Indigenous knowledge, bridging digital art, ceremony, and education.';
  if (pillars.has('freelancing') && pillars.has('materials-tools')) return 'I build a cross-pillar practice where services, materials, and cultural production support one another.';
  return 'I build a cross-pillar creator world where culture, commerce, and community support one another.';
}

function getPillarSectionTitle(pillar: ProfilePillarId) {
  return STOREFRONT_PILLAR_META[pillar as keyof typeof STOREFRONT_PILLAR_META]?.label ?? pillar;
}

function getPillarSectionDescription(pillar: ProfilePillarId) {
  switch (pillar) {
    case 'digital-arts': return 'Collect original works rooted in cultural storytelling and visual memory.';
    case 'physical-items': return 'Bring the practice into the physical world through objects, editions, and crafted pieces.';
    case 'courses': return 'Learn through guided teaching, cultural context, and the creator’s own methods.';
    case 'freelancing': return 'Hire for commissioned work, consulting, and culturally aligned collaboration.';
    case 'cultural-tourism': return 'Book experiences that extend the practice beyond the screen and into place.';
    case 'materials-tools': return 'Explore tools, kits, and creator infrastructure that support deeper participation.';
    default: return 'A curated section from this creator’s wider practice.';
  }
}

function getSignatureThemes(profile: CreatorProfileRecord) {
  const themes = new Set<string>();
  const combinedText = `${profile.bioShort} ${profile.bioLong} ${profile.offerings.map((offering) => `${offering.title} ${offering.blurb}`).join(' ')}`.toLowerCase();
  if (combinedText.includes('story')) themes.add('Storytelling');
  if (combinedText.includes('ceremon')) themes.add('Ceremony');
  if (combinedText.includes('land')) themes.add('Land memory');
  if (combinedText.includes('teach') || combinedText.includes('course')) themes.add('Teaching');
  if (combinedText.includes('visual')) themes.add('Visual language');
  if (combinedText.includes('community')) themes.add('Community practice');
  return Array.from(themes).slice(0, 4);
}

export function CreatorHero({ profile, isFollowing, averageReviewRating, onMessage, onFollow, onExploreFeatured }: { profile: CreatorProfileRecord; isFollowing: boolean; averageReviewRating: string | null; onMessage: () => void; onFollow: () => void; onExploreFeatured: () => void; }) {
  const roles = getCreatorRoles(profile);
  const signatureThemes = getSignatureThemes(profile);
  const identityLine = Array.from(new Set(profile.offerings.map((offering) => STOREFRONT_PILLAR_META[offering.pillar as keyof typeof STOREFRONT_PILLAR_META]?.shortLabel).filter(Boolean))).slice(0, 4).join(', ');
  const activePillars = Array.from(new Set(profile.offerings.map((offering) => offering.pillar))).slice(0, 5);

  return (
    <StorefrontHeroFrame
      cover={profile.cover}
      coverAlt={profile.displayName}
      badgeLabel="Creator universe"
      manageHref="/creator-hub"
      manageLabel="Creator view"
      identity={<div className="flex gap-4"><div className="h-20 w-20 overflow-hidden rounded-[20px] border-4 border-[#101010] bg-[#1b1b1b] shadow-[0_18px_45px_rgba(0,0,0,0.35)] md:h-24 md:w-24"><img src={profile.avatar} alt={profile.displayName} className="h-full w-full object-cover" /></div><div className="pt-2"><div className="flex flex-wrap items-center gap-2"><h1 className="text-3xl font-semibold tracking-tight text-white md:text-[2.6rem]">{profile.displayName}</h1><span className="inline-flex items-center gap-1 rounded-full bg-[#d4af37]/15 px-2.5 py-1 text-xs font-medium text-[#f7d98a]"><BadgeCheck size={13} />{profile.verificationLabel}</span></div><p className="mt-2 max-w-2xl text-base font-medium leading-7 text-[#f3dfb2]">{getNarrativeLine(profile)}</p><div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-[#d3cfc6]"><span className="inline-flex items-center gap-1.5"><MapPin size={14} className="text-[#d4af37]" />{profile.location}</span><span>{profile.nation}</span><span>{identityLine}</span></div><div className="mt-3 flex flex-wrap gap-2">{roles.map((role) => <span key={role} className="rounded-full border border-white/10 bg-black/25 px-3 py-1 text-xs text-[#f2e7d4]">{role}</span>)}</div></div></div>}
      actions={<div className="flex flex-wrap gap-3"><button onClick={onExploreFeatured} className="inline-flex items-center gap-2 rounded-full bg-[#d4af37] px-5 py-2.5 text-sm font-semibold text-black hover:bg-[#f4d370]"><Sparkles size={14} />Explore Featured Work</button><button onClick={onMessage} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white hover:border-[#d4af37]/35 hover:bg-[#d4af37]/10"><MessageSquare size={14} />Message</button><button onClick={onFollow} className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/30 bg-[#d4af37]/10 px-4 py-2.5 text-sm text-[#f3d780] hover:border-[#d4af37]/55 hover:bg-[#d4af37]/15"><UserPlus size={14} />{isFollowing ? 'Following' : 'Follow'}</button></div>}
      mainContent={<><p className="max-w-3xl text-base leading-7 text-[#f2e8d9]">{profile.bioShort}</p><div className="mt-4 flex flex-wrap gap-2">{signatureThemes.map((theme) => <span key={theme} className="rounded-full border border-[#d4af37]/20 bg-[#d4af37]/8 px-3 py-1 text-xs text-[#f2db9c]">{theme}</span>)}</div><div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><div className="rounded-[22px] border border-white/10 bg-black/20 p-4"><p className="text-xs uppercase tracking-[0.18em] text-gray-500">Followers</p><p className="mt-2 text-2xl font-semibold text-white">{profile.followerCount.toLocaleString()}</p></div><div className="rounded-[22px] border border-white/10 bg-black/20 p-4"><p className="text-xs uppercase tracking-[0.18em] text-gray-500">Collectors / clients / students</p><p className="mt-2 text-2xl font-semibold text-white">{profile.salesCount.toLocaleString()}</p></div><div className="rounded-[22px] border border-white/10 bg-black/20 p-4"><p className="text-xs uppercase tracking-[0.18em] text-gray-500">Active pillars</p><p className="mt-2 text-2xl font-semibold text-white">{activePillars.length}</p></div><div className="rounded-[22px] border border-white/10 bg-black/20 p-4"><p className="text-xs uppercase tracking-[0.18em] text-gray-500">Average rating</p><p className="mt-2 text-2xl font-semibold text-white">{averageReviewRating ?? '4.9'}</p></div></div></>}
      sideContent={<div className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(212,175,55,0.12),rgba(20,20,20,0.9))] p-4"><p className="text-xs uppercase tracking-[0.24em] text-[#d4af37]">Best known for</p><div className="mt-4 space-y-3">{activePillars.map((pillar) => <div key={pillar} className="rounded-[18px] border border-white/10 bg-black/25 p-3"><div className="flex items-center gap-2 text-sm font-medium text-white"><span className="inline-flex items-center text-[#d4af37]">{STOREFRONT_PILLAR_META[pillar as keyof typeof STOREFRONT_PILLAR_META]?.iconNode}</span>{getPillarSectionTitle(pillar)}</div><p className="mt-2 text-sm leading-6 text-[#d9d4cb]">{getPillarSectionDescription(pillar)}</p></div>)}</div></div>}
    />
  );
}
export function EngagementPathCards({ offerings }: { offerings: ProfileOffering[] }) {
  const pillars = Array.from(new Set(offerings.map((offering) => offering.pillar)));
  const cards = pillars.map((pillar) => {
    const meta = STOREFRONT_PILLAR_META[pillar as keyof typeof STOREFRONT_PILLAR_META];
    const lead = offerings.find((offering) => offering.pillar === pillar);
    return {
      pillar,
      title: pillar === 'digital-arts' ? 'Collect artwork' : pillar === 'courses' ? 'Learn through courses' : pillar === 'cultural-tourism' ? 'Book experiences' : pillar === 'freelancing' ? 'Hire for work' : pillar === 'materials-tools' ? 'Explore materials' : pillar === 'physical-items' ? 'Collect physical objects' : `Explore ${meta?.label ?? pillar}`,
      description: lead?.blurb ?? getPillarSectionDescription(pillar),
      href: `#pillar-${pillar}`,
      iconNode: meta?.iconNode
    };
  }).slice(0, 6);

  return <section className="space-y-5"><div><p className="text-xs uppercase tracking-[0.3em] text-[#d4af37]">Start here</p><h2 className="mt-2 text-3xl font-semibold text-white">How to engage with this creator</h2><p className="mt-3 max-w-3xl text-sm leading-7 text-[#d5cab8]">Start with the type of relationship you want first, then go deeper across the connected pillars of the practice.</p></div><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{cards.map((card) => <Link key={card.pillar} href={card.href} className="rounded-[24px] border border-white/10 bg-[#101010] p-5 transition-all hover:-translate-y-1 hover:border-[#d4af37]/35"><div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[#d4af37]/20 bg-[#d4af37]/10 text-[#f3d780]">{card.iconNode}</div><h3 className="mt-4 text-xl font-semibold text-white">{card.title}</h3><p className="mt-3 text-sm leading-6 text-[#d5cab8]">{card.description}</p><p className="mt-4 text-sm font-medium text-[#9fe5ea]">Start here</p></Link>)}</div></section>;
}

function getFeaturedReason(offering: ProfileOffering) {
  switch (offering.pillar) {
    case 'digital-arts': return 'A signature release that introduces the visual language of this creator’s world.';
    case 'courses': return 'A strong first step for learners who want context, craft, and direct access to the practice.';
    case 'freelancing': return 'A high-trust way to bring this creator’s vision into a live project or collaboration.';
    case 'cultural-tourism': return 'A bookable experience that turns the storefront into something lived, not just viewed.';
    case 'materials-tools': return 'A rooted supply offering that shows how the practice is built, taught, and sustained.';
    default: return 'A core entry point into this creator’s world, chosen for impact and clarity.';
  }
}

export function FeaturedWorkGrid({ offerings, onOfferClick }: { offerings: ProfileOffering[]; onOfferClick?: OfferClickHandler }) {
  if (offerings.length === 0) return null;
  const [primary, ...secondary] = offerings;

  return <section id="featured-work" className="space-y-6"><div><p className="text-xs uppercase tracking-[0.3em] text-[#d4af37]">Featured work</p><h2 className="mt-2 text-3xl font-semibold text-white">The strongest ways to engage with this creator first</h2><p className="mt-3 max-w-3xl text-sm leading-7 text-[#d5cab8]">Curated across pillars so a new visitor can understand what matters most before diving into the full catalog.</p></div><div className="grid gap-6 xl:grid-cols-[1.35fr,0.65fr]"><article className="overflow-hidden rounded-[32px] border border-[#d4af37]/25 bg-[linear-gradient(180deg,rgba(212,175,55,0.1),rgba(12,12,12,0.98))] shadow-[0_22px_60px_rgba(0,0,0,0.35)]"><div className="relative h-[28rem]"><img src={getOfferingImage(primary)} alt={primary.title} className="h-full w-full object-cover" /><div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.84))]" /><div className="absolute left-5 top-5 flex flex-wrap gap-2">{buildOfferBadges(primary, true, true).map((badge) => <span key={badge.id} className={badge.className}>{badge.label}</span>)}</div><div className="absolute bottom-0 left-0 right-0 p-7"><p className="text-xs uppercase tracking-[0.24em] text-[#d4af37]">Best first step</p><h3 className="mt-3 text-4xl font-semibold text-white">{primary.title}</h3><p className="mt-2 text-base text-[#e6dece]">{primary.type}</p><p className="mt-4 max-w-2xl text-base leading-8 text-[#f0e5d3]">{getFeaturedReason(primary)}</p><div className="mt-6 flex items-center justify-between gap-4"><span className="text-2xl font-semibold text-[#f3d780]">{primary.priceLabel}</span><Link href={primary.href} onClick={() => onOfferClick?.(primary)} className="rounded-full bg-[#d4af37] px-6 py-3 text-sm font-semibold text-black hover:bg-[#f4d370]">{getOfferingCtaLabel(primary)}</Link></div></div></div></article><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">{secondary.slice(0, 3).map((offering) => <Link key={offering.id} href={offering.href} onClick={() => onOfferClick?.(offering)} className="rounded-[24px] border border-white/10 bg-[#101010] p-4 transition-all hover:-translate-y-0.5 hover:border-[#d4af37]/30"><div className="flex gap-4"><img src={getOfferingImage(offering)} alt={offering.title} className="h-28 w-28 rounded-[18px] object-cover" /><div className="min-w-0 flex-1"><div className="flex flex-wrap gap-2">{buildOfferBadges(offering, false, true).map((badge) => <span key={badge.id} className={badge.className}>{badge.label}</span>)}</div><h3 className="mt-3 text-lg font-semibold text-white">{offering.title}</h3><p className="mt-2 text-sm leading-6 text-[#d5cab8]">{getFeaturedReason(offering)}</p><div className="mt-4 flex items-center justify-between gap-3 text-sm"><span className="font-semibold text-[#d4af37]">{offering.priceLabel}</span><span className="text-white">{getOfferingCtaLabel(offering)}</span></div></div></div></Link>)}</div></div></section>;
}

export function AboutPracticeSection({ profile }: { profile: CreatorProfileRecord }) {
  const pillars = Array.from(new Set(profile.offerings.map((offering) => offering.pillar))).slice(0, 4);
  const flowLabels: Record<string, string> = { 'digital-arts': 'Create', courses: 'Teach', 'cultural-tourism': 'Experience', freelancing: 'Collaborate', 'materials-tools': 'Equip', 'physical-items': 'Collect' };
  return <section className="grid gap-6 lg:grid-cols-[1.05fr,0.95fr]"><article className="rounded-[30px] border border-white/10 bg-[#101010] p-6"><p className="text-xs uppercase tracking-[0.3em] text-[#d4af37]">About the practice</p><h2 className="mt-3 text-3xl font-semibold text-white">A cross-pillar practice built with cultural grounding</h2><p className="mt-4 text-sm leading-8 text-[#d7d1c6]">{profile.bioLong}</p></article><article className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(212,175,55,0.08),rgba(0,0,0,0.28))] p-6"><p className="text-xs uppercase tracking-[0.3em] text-[#d4af37]">How the work connects</p><div className="mt-4 grid gap-3">{pillars.map((pillar, index) => <div key={pillar} className="grid grid-cols-[auto,1fr] items-start gap-4 rounded-[22px] border border-white/10 bg-black/20 p-4"><div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d4af37]/20 bg-[#d4af37]/10 text-sm font-semibold text-[#f2d27f]">{index + 1}</div><div><p className="text-xs uppercase tracking-[0.22em] text-[#d4af37]">{flowLabels[pillar] ?? 'Connect'}</p><div className="mt-1 flex items-center gap-2 text-sm font-medium text-white"><span className="inline-flex items-center text-[#d4af37]">{STOREFRONT_PILLAR_META[pillar as keyof typeof STOREFRONT_PILLAR_META]?.iconNode}</span>{getPillarSectionTitle(pillar)}</div><p className="mt-2 text-sm leading-6 text-[#d5cab8]">{getPillarSectionDescription(pillar)}</p></div></div>)}</div></article></section>;
}
export function CrossPillarBundleCards({ profileSlug, bundles, onBundleClick }: { profileSlug: string; bundles: ProfileBundle[]; onBundleClick?: (bundleId: string) => void; }) {
  if (bundles.length === 0) return null;
  return <section className="space-y-6"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs uppercase tracking-[0.3em] text-[#d4af37]">Start here</p><h2 className="mt-2 text-3xl font-semibold text-white">Best ways to enter this creator’s world</h2><p className="mt-3 max-w-3xl text-sm leading-7 text-[#d5cab8]">These paths reduce decision fatigue and show how courses, services, experiences, and objects can work together.</p></div><Link href={`/profile/${profileSlug}/bundles`} className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm text-white hover:border-[#d4af37]/35 hover:text-[#f3d780]">View all bundles</Link></div><div className="grid gap-6 xl:grid-cols-2">{bundles.slice(0, 2).map((bundle, index) => <Link key={bundle.id} href={`/profile/${profileSlug}/bundles/${bundle.id}`} onClick={() => onBundleClick?.(bundle.id)} className="overflow-hidden rounded-[32px] border border-[#d4af37]/22 bg-[linear-gradient(180deg,rgba(212,175,55,0.1),rgba(12,12,12,0.98))] shadow-[0_22px_60px_rgba(0,0,0,0.32)] transition-all hover:-translate-y-1 hover:border-[#d4af37]/35"><div className="relative h-64"><img src={bundle.cover} alt={bundle.name} className="h-full w-full object-cover" /><div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.82))]" /><div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-[#d4af37]/30 bg-black/35 px-3 py-1 text-xs text-[#f3d780]"><Layers3 size={12} />{index === 0 ? 'Best way to start' : 'Curated path'}</div><div className="absolute right-5 top-5 rounded-full border border-white/15 bg-black/35 px-3 py-1 text-xs text-white">{bundle.savingsLabel}</div><div className="absolute inset-x-0 bottom-0 p-5"><h3 className="text-3xl font-semibold text-white">{bundle.name}</h3><p className="mt-2 max-w-2xl text-sm leading-6 text-[#ece4d5]">{bundle.summary}</p></div></div><div className="grid gap-5 p-6 lg:grid-cols-[1fr,1.05fr]"><div className="space-y-4"><div className="flex flex-wrap gap-2">{bundle.pillarBreakdown.map((entry) => <span key={entry.pillar} className="rounded-full border border-white/10 bg-black/25 px-3 py-1.5 text-xs text-gray-300">{getPillarSectionTitle(entry.pillar)} ({entry.count})</span>)}</div><div className="rounded-[22px] border border-[#d4af37]/20 bg-black/20 p-4"><p className="text-xs uppercase tracking-[0.22em] text-[#d4af37]">Bundle value</p><p className="mt-3 text-2xl font-semibold text-white">{bundle.priceLabel}</p><p className="mt-2 text-sm leading-6 text-gray-300">{bundle.savingsLabel}</p></div></div><div className="rounded-[22px] border border-white/10 bg-black/20 p-4"><p className="text-xs uppercase tracking-[0.22em] text-[#d4af37]">Why start here</p><p className="mt-3 text-sm leading-7 text-[#d5cab8]">{bundle.leadAudience === 'collectors' ? 'Best for collectors who want a deeper introduction to the creator’s world, not a one-off purchase.' : bundle.leadAudience === 'clients' ? 'Best for clients who want a guided path across services, experiences, and supporting materials.' : 'A guided entry path that connects multiple offerings into one intentional experience.'}</p><p className="mt-4 text-sm font-medium text-[#9fe5ea]">Open bundle path</p></div></div></Link>)}</div></section>;
}

export function PillarSection({ profileSlug, pillar, offerings, onOfferClick }: { profileSlug: string; pillar: ProfilePillarId; offerings: ProfileOffering[]; onOfferClick?: OfferClickHandler; }) {
  if (offerings.length === 0) return null;
  const meta = STOREFRONT_PILLAR_META[pillar as keyof typeof STOREFRONT_PILLAR_META];
  return <section id={`pillar-${pillar}`} className="space-y-5"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs uppercase tracking-[0.3em] text-[#d4af37]">{meta?.label ?? pillar}</p><h2 className="mt-2 text-3xl font-semibold text-white">{getPillarSectionTitle(pillar)}</h2><p className="mt-3 max-w-3xl text-sm leading-7 text-[#d5cab8]">{getPillarSectionDescription(pillar)}</p><p className="mt-2 text-sm leading-6 text-[#f1e0b0]">{offerings[0]?.blurb ?? 'A curated starting point inside this part of the practice.'}</p></div><Link href={`/profile/${profileSlug}/${pillar}`} className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm text-white hover:border-[#d4af37]/35 hover:text-[#f3d780]">View all</Link></div><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{offerings.slice(0, 4).map((offering, index) => <StorefrontOfferCard key={offering.id} href={offering.href} image={getOfferingImage(offering)} title={offering.title} typeLabel={offering.type} pillarLabel={offering.pillarLabel} pillarIcon={meta?.iconNode} priceLabel={offering.priceLabel} ctaLabel={getOfferingCtaLabel(offering)} blurb={offering.blurb} metadata={offering.metadata ?? []} badges={buildOfferBadges(offering, index === 0 && offering.featured, false)} actionHint={index === 0 ? 'Strong first pick in this pillar' : undefined} onClick={() => onOfferClick?.(offering)} />)}</div></section>;
}

export function SocialProofStrip({ profileSlug, reviews, trustSignals, averageReviewRating, salesCount }: { profileSlug: string; reviews: ProfileFeaturedReview[]; trustSignals: ProfileTrustSignal[]; averageReviewRating: string | null; salesCount: number; }) {
  const spotlightSignals = trustSignals.slice(0, 3);
  return <section className="space-y-6"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs uppercase tracking-[0.3em] text-[#d4af37]">Social proof</p><h2 className="mt-2 text-3xl font-semibold text-white">Proof that people trust this creator across pillars</h2></div><Link href={`/profile/${profileSlug}/reviews`} className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm text-white hover:border-[#d4af37]/35 hover:text-[#f3d780]">View all reviews</Link></div><div className="grid gap-4 lg:grid-cols-[0.85fr,1.15fr]"><article className="rounded-[28px] border border-[#d4af37]/18 bg-[linear-gradient(180deg,rgba(212,175,55,0.08),rgba(12,12,12,0.98))] p-6"><p className="text-xs uppercase tracking-[0.24em] text-[#d4af37]">Why buyers come back</p><div className="mt-5 grid gap-3 sm:grid-cols-2"><div className="rounded-[20px] border border-white/10 bg-black/20 p-4"><p className="text-xs uppercase tracking-[0.18em] text-gray-500">Average rating</p><p className="mt-2 text-3xl font-semibold text-white">{averageReviewRating ?? '4.9'}</p><p className="mt-2 text-sm text-[#d5cab8]">Across collectors, students, and clients</p></div><div className="rounded-[20px] border border-white/10 bg-black/20 p-4"><p className="text-xs uppercase tracking-[0.18em] text-gray-500">Recent buyers</p><p className="mt-2 text-3xl font-semibold text-white">{salesCount.toLocaleString()}</p><p className="mt-2 text-sm text-[#d5cab8]">Collectors, learners, and collaborators</p></div></div><div className="mt-4 space-y-3">{spotlightSignals.map((signal) => <div key={signal.id} className="rounded-[20px] border border-white/10 bg-black/20 p-4"><p className="text-xs uppercase tracking-[0.18em] text-gray-500">{signal.label}</p><p className="mt-2 text-2xl font-semibold text-white">{signal.value}</p><p className="mt-2 text-sm leading-6 text-[#d5cab8]">{signal.detail}</p></div>)}</div></article><div className="grid gap-4 md:grid-cols-3">{reviews.slice(0, 3).map((review) => <article key={review.id} className="rounded-[24px] border border-white/10 bg-[#101010] p-5"><div className="flex items-center justify-between gap-3"><div className="flex items-center gap-1 text-[#d4af37]">{Array.from({ length: review.rating }).map((_, index) => <Star key={`${review.id}-${index}`} size={14} fill="currentColor" />)}</div><span className="rounded-full border border-white/10 bg-black/20 px-2.5 py-1 text-[11px] text-[#f3d780]">{review.pillar === 'courses' ? 'Student' : review.pillar === 'freelancing' ? 'Client' : 'Collector'}</span></div><p className="mt-4 text-base font-semibold text-white">{review.title}</p><p className="mt-3 text-sm leading-7 text-[#d5cab8]">"{review.quote}"</p><div className="mt-4 text-sm text-gray-400"><span className="text-white">{review.authorName}</span><span className="ml-2">{review.ago}</span></div></article>)}</div></div></section>;
}

export function CreatorConnectionSection({ profile }: { profile: CreatorProfileRecord }) {
  const cards = [
    ...profile.activity.slice(0, 2).map((item) => ({ title: item.title, description: item.detail, href: '/community', label: 'Join conversation' })),
    ...(profile.collections[0] ? [{ title: profile.collections[0].name, description: profile.collections[0].summary, href: `/profile/${profile.slug}/bundles`, label: 'View collections' }] : []),
    ...(profile.socials[0] ? [{ title: `${profile.socials[0].label} updates`, description: 'Follow behind-the-scenes process, releases, and community-facing updates beyond the storefront.', href: profile.socials[0].href, label: 'Open channel' }] : [])
  ].slice(0, 4);

  return <section className="space-y-6"><div><p className="text-xs uppercase tracking-[0.3em] text-[#d4af37]">Related connections</p><h2 className="mt-2 text-3xl font-semibold text-white">See the ecosystem around this practice</h2><p className="mt-3 max-w-3xl text-sm leading-7 text-[#d5cab8]">Storefronts on Indigena do better when they connect back to process, conversation, and the community around the work.</p></div><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{cards.map((card) => <Link key={`${card.title}-${card.href}`} href={card.href} className="rounded-[24px] border border-white/10 bg-[#101010] p-5 transition-all hover:-translate-y-1 hover:border-[#d4af37]/35"><p className="text-lg font-semibold text-white">{card.title}</p><p className="mt-3 text-sm leading-6 text-[#d5cab8]">{card.description}</p><div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[#9fe5ea]">{card.label}<ExternalLink size={14} /></div></Link>)}</div></section>;
}

export function FinalSupportCTA({ profileSlug, onMessage, onFollow }: { profileSlug: string; onMessage: () => void; onFollow: () => void; }) {
  return <section className="rounded-[30px] border border-[#d4af37]/20 bg-[linear-gradient(135deg,rgba(18,13,9,0.98),rgba(11,11,11,0.98))] p-6 md:p-7"><p className="text-[11px] uppercase tracking-[0.28em] text-[#d4af37]">Support the creator</p><h2 className="mt-3 text-3xl font-semibold text-white">Support this creator’s work across art, culture, and community.</h2><p className="mt-3 max-w-3xl text-sm leading-7 text-[#d5cab8]">Follow, collect, book, learn, or collaborate through the parts of the practice that matter most to you first, then go deeper across the rest of the storefront.</p><div className="mt-5 flex flex-wrap gap-3"><Link href={`/profile/${profileSlug}/digital-arts`} className="rounded-full bg-[#d4af37] px-5 py-3 text-sm font-semibold text-black transition hover:bg-[#f0c96f]">Collect Work</Link><Link href={`/profile/${profileSlug}/cultural-tourism`} className="rounded-full border border-[#9b6b2b]/35 px-5 py-3 text-sm font-medium text-[#e3be83] transition hover:bg-[#9b6b2b]/12">Book Experience</Link><button onClick={onFollow} className="rounded-full border border-[#9b6b2b]/35 px-5 py-3 text-sm font-medium text-[#e3be83] transition hover:bg-[#9b6b2b]/12">Follow Creator</button></div></section>;
}
