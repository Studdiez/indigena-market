'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, BadgeCheck, MessageSquare, Sparkles, UserPlus } from 'lucide-react';
import type { CreatorProfileRecord, ProfileFeaturedReview, ProfileOffering, ProfilePillarId, ProfileTrustSignal } from '@/app/profile/data/profileShowcase';
import { fetchPublicProfile, sendProfileMessage, toggleProfileFollow, trackProfileAnalyticsEvent } from '@/app/lib/profileApi';
import { requireWalletAction } from '@/app/lib/requireWalletAction';
import { getOfferingCtaLabel, getOfferingImage, getOfferingLaunchBadge, getOfferingMerchandisingScore, shouldShowOfferingInStorefront } from '@/app/profile/lib/offeringMerchandising';
import { CreatorHero, FinalSupportCTA, SocialProofStrip, STOREFRONT_PILLAR_META } from '@/app/components/storefront/CreatorStorefrontSections';
import type { StorefrontOfferBadge } from '@/app/components/storefront/StorefrontOfferCard';
import StorefrontOfferCard from '@/app/components/storefront/StorefrontOfferCard';

const MESSAGE_INTENTS = [
  { id: 'general', label: 'General' },
  { id: 'commission', label: 'Commission' },
  { id: 'booking', label: 'Booking' },
  { id: 'licensing', label: 'Licensing' },
  { id: 'wholesale', label: 'Wholesale' },
  { id: 'collaboration', label: 'Collaboration' }
] as const;

const PILLAR_INTRO: Record<Exclude<ProfilePillarId, 'seva'>, { kicker: string; heading: string; description: string; emotionalLine: string; primaryAction: string }> = {
  'digital-arts': {
    kicker: 'Digital art practice',
    heading: 'Collect the visual language of this creator\'s world',
    description: 'This pillar brings the creator\'s visual storytelling into focus through original releases, collector drops, and culturally grounded digital works.',
    emotionalLine: 'Each release carries motifs, memory, and authorship that connect back to the wider practice.',
    primaryAction: 'Collect artwork'
  },
  'physical-items': {
    kicker: 'Physical objects',
    heading: 'Bring the practice into the physical world',
    description: 'Objects, editions, and crafted pieces give the storefront a tangible presence and deepen the relationship beyond the screen.',
    emotionalLine: 'These pieces hold material story, process, and care in a way only physical work can.',
    primaryAction: 'Collect objects'
  },
  courses: {
    kicker: 'Learning practice',
    heading: 'Learn directly through this creator\'s methods',
    description: 'Courses turn the storefront into a teaching environment with structure, context, and guided access to knowledge.',
    emotionalLine: 'This is where the practice becomes something you can study, return to, and grow with.',
    primaryAction: 'Start learning'
  },
  freelancing: {
    kicker: 'Services practice',
    heading: 'Hire this creator for culturally grounded work',
    description: 'Services and advisory offerings translate the creator\'s voice into commissions, consulting, and live collaboration.',
    emotionalLine: 'It is the clearest way to bring their worldview into a real project with trust and direction.',
    primaryAction: 'Hire this creator'
  },
  'cultural-tourism': {
    kicker: 'Experiences practice',
    heading: 'Step into the creator\'s world through place and experience',
    description: 'Experiences extend the storefront beyond products into guided journeys, gatherings, and cultural exchange.',
    emotionalLine: 'This pillar turns the relationship from viewing into being present with the work in context.',
    primaryAction: 'Book experience'
  },
  'language-heritage': {
    kicker: 'Language & heritage practice',
    heading: 'Preserve and learn through living language work',
    description: 'This pillar gathers language-based teaching, archives, and cultural preservation work into one focused entry point.',
    emotionalLine: 'It keeps knowledge active by making it shareable, teachable, and supported.',
    primaryAction: 'Explore learning'
  },
  'land-food': {
    kicker: 'Land & food practice',
    heading: 'Enter the creator\'s work through food, land, and stewardship',
    description: 'Products, sourcing, and regenerative offerings connect the storefront to living systems of production and care.',
    emotionalLine: 'This is where commerce, land relationship, and long-term community value meet.',
    primaryAction: 'Explore offerings'
  },
  'advocacy-legal': {
    kicker: 'Advocacy & legal practice',
    heading: 'Support protection work with clarity and trust',
    description: 'Legal services, tools, and defense-oriented offerings make this part of the creator\'s work practical, urgent, and high-trust.',
    emotionalLine: 'It turns expertise into something communities can rely on when the stakes are real.',
    primaryAction: 'Access support'
  },
  'materials-tools': {
    kicker: 'Materials & tools practice',
    heading: 'Equip the work with rooted tools and materials',
    description: 'This pillar focuses on the kits, inputs, and supply-layer offerings that make the rest of the practice possible.',
    emotionalLine: 'The tools themselves carry process, lineage, and the conditions for creation.',
    primaryAction: 'Browse tools'
  }
};

function buildOfferBadges(offering: ProfileOffering, featured = false): StorefrontOfferBadge[] {
  const badges: StorefrontOfferBadge[] = [];
  if (featured) badges.push({ id: 'featured', label: 'Featured', className: 'rounded-full border border-[#d4af37]/30 bg-[#d4af37]/10 px-2.5 py-1 text-[11px] text-[#f2d27f]' });
  if (offering.featured && !featured) badges.push({ id: 'community-favorite', label: 'Community Favorite', className: 'rounded-full border border-[#d4af37]/25 bg-black/30 px-2.5 py-1 text-[11px] text-[#f4d98c]' });
  if (offering.ctaPreset === 'collect-now') badges.push({ id: 'collector-pick', label: 'Collector Pick', className: 'rounded-full border border-white/15 bg-black/35 px-2.5 py-1 text-[11px] text-white' });
  if (offering.ctaPreset === 'book-now') badges.push({ id: 'bookable', label: 'Bookable', className: 'rounded-full border border-cyan-400/30 bg-cyan-400/10 px-2.5 py-1 text-[11px] text-cyan-100' });
  if (offering.ctaPreset === 'enroll-now') badges.push({ id: 'enrolling', label: 'Enrolling', className: 'rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1 text-[11px] text-emerald-200' });
  const launchBadge = getOfferingLaunchBadge(offering);
  if (launchBadge) badges.push({ id: 'launch', label: launchBadge, className: 'rounded-full border border-[#8fd7dc]/30 bg-[#8fd7dc]/10 px-2.5 py-1 text-[11px] text-[#b7edf1]' });
  if ((offering.availabilityLabel || '').toLowerCase().includes('left')) badges.push({ id: 'limited', label: 'Limited', className: 'rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-1 text-[11px] text-amber-100' });
  return badges.slice(0, 3);
}

function getRelatedPathLabel(pillar: ProfilePillarId) {
  switch (pillar) {
    case 'courses': return 'Keep learning';
    case 'freelancing': return 'Hire this creator';
    case 'cultural-tourism': return 'Book the experience';
    case 'materials-tools': return 'Browse tools';
    default: return 'Explore more';
  }
}

function getReviewContext(review: ProfileFeaturedReview) {
  return review.pillar === 'courses' ? 'Student' : review.pillar === 'freelancing' ? 'Client' : review.pillar === 'cultural-tourism' ? 'Traveler' : 'Collector';
}

export default function PublicProfilePillarClient({
  profile: initialProfile,
  slug,
  pillar
}: {
  profile: CreatorProfileRecord;
  slug: string;
  pillar: Exclude<ProfilePillarId, 'seva'>;
}) {
  const [profile, setProfile] = useState(initialProfile);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageSubject, setMessageSubject] = useState('');
  const [messageBody, setMessageBody] = useState('');
  const [messageIntent, setMessageIntent] = useState<(typeof MESSAGE_INTENTS)[number]['id']>('general');
  const [messageFeedback, setMessageFeedback] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchPublicProfile(slug)
      .then((data) => {
        if (cancelled) return;
        setProfile(data.profile);
        setIsFollowing(Boolean(data.isFollowing));
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    trackProfileAnalyticsEvent({
      profileSlug: slug,
      eventName: 'storefront_view',
      pageKind: 'profile',
      metadata: { pillar }
    });
  }, [pillar, slug]);

  const visibleOfferings = useMemo(() => {
    return profile.offerings
      .filter((offering) => shouldShowOfferingInStorefront(offering))
      .sort((a, b) => getOfferingMerchandisingScore(b) - getOfferingMerchandisingScore(a));
  }, [profile.offerings]);

  const pillarOfferings = useMemo(() => visibleOfferings.filter((offering) => offering.pillar === pillar), [pillar, visibleOfferings]);
  const leadOffering = pillarOfferings[0] ?? null;
  const secondaryOfferings = pillarOfferings.slice(1, 5);
  const relatedBundles = useMemo(() => profile.bundles.filter((bundle) => bundle.pillarBreakdown.some((entry) => entry.pillar === pillar)).slice(0, 2), [pillar, profile.bundles]);
  const relatedPaths = useMemo(() => visibleOfferings.filter((offering) => offering.pillar !== pillar).slice(0, 3), [pillar, visibleOfferings]);
  const relevantReviews = useMemo(() => {
    const direct = profile.featuredReviews.filter((review) => review.pillar === pillar);
    return direct.length > 0 ? direct : profile.featuredReviews.slice(0, 3);
  }, [pillar, profile.featuredReviews]);
  const relevantTrustSignals = useMemo<ProfileTrustSignal[]>(() => profile.trustSignals.slice(0, 3), [profile.trustSignals]);
  const averageReviewRating = useMemo(() => {
    if (relevantReviews.length === 0) return null;
    const total = relevantReviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / relevantReviews.length).toFixed(1);
  }, [relevantReviews]);

  const intro = PILLAR_INTRO[pillar];
  const pillarMeta = STOREFRONT_PILLAR_META[pillar];

  const handleFollow = async () => {
    try {
      await requireWalletAction(isFollowing ? 'manage follows' : 'follow this creator');
      const result = await toggleProfileFollow(profile.slug, !isFollowing);
      setIsFollowing(result.isFollowing);
      setProfile((prev) => ({ ...prev, followerCount: result.followerCount }));
    } catch (error) {
      setMessageFeedback(error instanceof Error ? error.message : 'Unable to update follow state.');
    }
  };

  const openMessageModal = () => {
    trackProfileAnalyticsEvent({ profileSlug: profile.slug, eventName: 'message_open', pageKind: 'profile', metadata: { pillar } });
    setShowMessageModal(true);
  };

  const jumpToFeatured = () => {
    const target = document.getElementById('pillar-featured-work');
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const trackOfferClick = (offering: ProfileOffering) => {
    trackProfileAnalyticsEvent({
      profileSlug: profile.slug,
      eventName: 'offer_open',
      pageKind: 'profile',
      offeringId: offering.id,
      metadata: { pillar: offering.pillar, href: offering.href, focusedPillar: pillar }
    });
  };

  if (!leadOffering) {
    return (
      <div className="space-y-8">
        <CreatorHero
          profile={profile}
          isFollowing={isFollowing}
          averageReviewRating={averageReviewRating}
          onMessage={openMessageModal}
          onFollow={handleFollow}
          onExploreFeatured={jumpToFeatured}
        />
        <section className="rounded-[30px] border border-white/10 bg-[#101010] p-8 text-center">
          <p className="text-xs uppercase tracking-[0.28em] text-[#d4af37]">{pillarMeta.label}</p>
          <h2 className="mt-3 text-3xl font-semibold text-white">This part of the creator world is coming together now</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#d5cab8]">There are not yet any public offerings in this pillar. The creator storefront still gives you strong ways to engage through the main profile and related work.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href={`/profile/${slug}`} className="rounded-full bg-[#d4af37] px-5 py-3 text-sm font-semibold text-black hover:bg-[#f4d370]">Back to creator storefront</Link>
            <button onClick={openMessageModal} className="rounded-full border border-white/10 bg-black/20 px-5 py-3 text-sm text-white hover:border-[#d4af37]/35 hover:text-[#f3d780]">Message creator</button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <CreatorHero
        profile={profile}
        isFollowing={isFollowing}
        averageReviewRating={averageReviewRating}
        onMessage={openMessageModal}
        onFollow={handleFollow}
        onExploreFeatured={jumpToFeatured}
      />

      <section className="grid gap-6 xl:grid-cols-[1.15fr,0.85fr]">
        <article className="rounded-[30px] border border-[#d4af37]/20 bg-[linear-gradient(180deg,rgba(212,175,55,0.08),rgba(10,10,10,0.98))] p-7">
          <Link href={`/profile/${slug}`} className="inline-flex items-center gap-2 text-sm text-[#f3d780] hover:text-[#f7df9e]">
            <ArrowLeft size={15} />Back to creator storefront
          </Link>
          <p className="mt-5 text-xs uppercase tracking-[0.28em] text-[#d4af37]">{intro.kicker}</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight text-white">{intro.heading}</h2>
          <p className="mt-4 max-w-3xl text-base leading-8 text-[#ece3d5]">{intro.description}</p>
          <p className="mt-4 max-w-3xl text-base font-medium leading-8 text-[#f3ddb0]">{intro.emotionalLine}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={leadOffering.href} onClick={() => trackOfferClick(leadOffering)} className="rounded-full bg-[#d4af37] px-5 py-3 text-sm font-semibold text-black hover:bg-[#f4d370]">{intro.primaryAction}</Link>
            <button onClick={openMessageModal} className="rounded-full border border-white/10 bg-black/20 px-5 py-3 text-sm text-white hover:border-[#d4af37]/35 hover:text-[#f3d780]">Ask about this pillar</button>
          </div>
        </article>
        <aside className="rounded-[30px] border border-white/10 bg-[#101010] p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[#d4af37]">Focused view</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
            <div className="rounded-[22px] border border-white/10 bg-black/20 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-gray-500">Public offerings</p>
              <p className="mt-2 text-3xl font-semibold text-white">{pillarOfferings.length}</p>
              <p className="mt-2 text-sm text-[#d5cab8]">Available now in this pillar</p>
            </div>
            <div className="rounded-[22px] border border-white/10 bg-black/20 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-gray-500">Best-known signal</p>
              <p className="mt-2 text-xl font-semibold text-white">{leadOffering.availabilityLabel || leadOffering.type}</p>
              <p className="mt-2 text-sm text-[#d5cab8]">{pillarMeta.label} inside the broader creator world</p>
            </div>
            <div className="rounded-[22px] border border-white/10 bg-black/20 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-gray-500">Related bundle paths</p>
              <p className="mt-2 text-3xl font-semibold text-white">{relatedBundles.length}</p>
              <p className="mt-2 text-sm text-[#d5cab8]">Ways this pillar connects to other offerings</p>
            </div>
          </div>
        </aside>
      </section>

      <section id="pillar-featured-work" className="space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[#d4af37]">Featured in this pillar</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">Start with the strongest work in {pillarMeta.label.toLowerCase()}</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[#d5cab8]">The lead offering gives visitors a clear first click, while the supporting picks show the range inside this focused part of the storefront.</p>
        </div>
        <div className="grid gap-6 xl:grid-cols-[1.2fr,0.8fr]">
          <article className="overflow-hidden rounded-[32px] border border-[#d4af37]/25 bg-[linear-gradient(180deg,rgba(212,175,55,0.08),rgba(12,12,12,0.98))] shadow-[0_22px_60px_rgba(0,0,0,0.35)]">
            <div className="relative h-[30rem]">
              <img src={getOfferingImage(leadOffering)} alt={leadOffering.title} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.86))]" />
              <div className="absolute left-5 top-5 flex flex-wrap gap-2">
                {buildOfferBadges(leadOffering, true).map((badge) => <span key={badge.id} className={badge.className}>{badge.label}</span>)}
              </div>
              <div className="absolute inset-x-0 bottom-0 p-7">
                <p className="text-xs uppercase tracking-[0.24em] text-[#d4af37]">Lead entry point</p>
                <h3 className="mt-3 text-4xl font-semibold text-white">{leadOffering.title}</h3>
                <p className="mt-2 text-base text-[#e6dece]">{leadOffering.type}</p>
                <p className="mt-4 max-w-2xl text-base leading-8 text-[#f0e5d3]">{leadOffering.blurb}</p>
                <div className="mt-6 flex items-center justify-between gap-4">
                  <span className="text-2xl font-semibold text-[#f3d780]">{leadOffering.priceLabel}</span>
                  <Link href={leadOffering.href} onClick={() => trackOfferClick(leadOffering)} className="rounded-full bg-[#d4af37] px-6 py-3 text-sm font-semibold text-black hover:bg-[#f4d370]">{getOfferingCtaLabel(leadOffering)}</Link>
                </div>
              </div>
            </div>
          </article>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
            {secondaryOfferings.map((offering) => (
              <StorefrontOfferCard
                key={offering.id}
                href={offering.href}
                image={getOfferingImage(offering)}
                title={offering.title}
                typeLabel={offering.type}
                pillarLabel={offering.pillarLabel}
                pillarIcon={pillarMeta.iconNode}
                priceLabel={offering.priceLabel}
                ctaLabel={getOfferingCtaLabel(offering)}
                blurb={offering.blurb}
                metadata={offering.metadata ?? []}
                badges={buildOfferBadges(offering)}
                actionHint="Supporting pick in this pillar"
                onClick={() => trackOfferClick(offering)}
              />
            ))}
          </div>
        </div>
      </section>

      {relatedBundles.length > 0 ? (
        <section className="space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#d4af37]">Bundle paths</p>
              <h2 className="mt-2 text-3xl font-semibold text-white">Go deeper through curated cross-pillar paths</h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-[#d5cab8]">This pillar is strongest when it connects back to the wider creator world. These bundle paths are the clearest next step.</p>
            </div>
            <Link href={`/profile/${slug}/bundles`} className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm text-white hover:border-[#d4af37]/35 hover:text-[#f3d780]">View all bundles</Link>
          </div>
          <div className="grid gap-6 xl:grid-cols-2">
            {relatedBundles.map((bundle, index) => (
              <Link key={bundle.id} href={`/profile/${slug}/bundles/${bundle.id}`} className="overflow-hidden rounded-[30px] border border-[#d4af37]/20 bg-[linear-gradient(180deg,rgba(212,175,55,0.08),rgba(12,12,12,0.98))] p-6 transition-all hover:-translate-y-1 hover:border-[#d4af37]/35">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-[#d4af37]">{index === 0 ? 'Best way to expand' : 'Curated connection'}</p>
                    <h3 className="mt-3 text-2xl font-semibold text-white">{bundle.name}</h3>
                  </div>
                  <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-white">{bundle.savingsLabel}</span>
                </div>
                <p className="mt-4 text-sm leading-7 text-[#d5cab8]">{bundle.summary}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {bundle.pillarBreakdown.map((entry) => (
                    <span key={entry.pillar} className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-gray-300">{STOREFRONT_PILLAR_META[entry.pillar as Exclude<ProfilePillarId, 'seva'>]?.label} ({entry.count})</span>
                  ))}
                </div>
                <p className="mt-5 text-sm font-medium text-[#9fe5ea]">Open bundle path</p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <section className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#d4af37]">All {pillarMeta.label.toLowerCase()}</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">Browse everything in this practice</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[#d5cab8]">A focused browse surface for this pillar, with the creator story still holding the page together.</p>
          </div>
          <Link href={`/profile/${slug}`} className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm text-white hover:border-[#d4af37]/35 hover:text-[#f3d780]">Back to overview</Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {pillarOfferings.map((offering, index) => (
            <StorefrontOfferCard
              key={offering.id}
              href={offering.href}
              image={getOfferingImage(offering)}
              title={offering.title}
              typeLabel={offering.type}
              pillarLabel={offering.pillarLabel}
              pillarIcon={pillarMeta.iconNode}
              priceLabel={offering.priceLabel}
              ctaLabel={getOfferingCtaLabel(offering)}
              blurb={offering.blurb}
              metadata={offering.metadata ?? []}
              badges={buildOfferBadges(offering, index === 0 && !leadOffering.featured)}
              actionHint={index === 0 ? 'Strong first pick in this pillar' : undefined}
              onClick={() => trackOfferClick(offering)}
            />
          ))}
        </div>
      </section>

      {relatedPaths.length > 0 ? (
        <section className="space-y-6">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#d4af37]">Connected paths</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">See how this pillar connects to the wider creator world</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[#d5cab8]">The best storefronts on Indigena don’t isolate one category. They show how one kind of engagement leads naturally into another.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {relatedPaths.map((offering) => {
              const meta = STOREFRONT_PILLAR_META[offering.pillar as Exclude<ProfilePillarId, 'seva'>];
              return (
                <Link key={offering.id} href={`/profile/${slug}/${offering.pillar}`} className="rounded-[24px] border border-white/10 bg-[#101010] p-5 transition-all hover:-translate-y-1 hover:border-[#d4af37]/35">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[#d4af37]/20 bg-[#d4af37]/10 text-[#f3d780]">{meta?.iconNode}</div>
                  <p className="mt-4 text-lg font-semibold text-white">{meta?.label}</p>
                  <p className="mt-3 text-sm leading-6 text-[#d5cab8]">{offering.blurb}</p>
                  <p className="mt-4 text-sm font-medium text-[#9fe5ea]">{getRelatedPathLabel(offering.pillar)}</p>
                </Link>
              );
            })}
          </div>
        </section>
      ) : null}

      <SocialProofStrip
        profileSlug={profile.slug}
        reviews={relevantReviews}
        trustSignals={relevantTrustSignals}
        averageReviewRating={averageReviewRating}
        salesCount={profile.salesCount}
      />

      <section className="space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[#d4af37]">Why this practice stands out</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">Recognition that carries across this pillar</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {relevantReviews.slice(0, 3).map((review) => (
            <article key={review.id} className="rounded-[24px] border border-white/10 bg-[#101010] p-5">
              <span className="rounded-full border border-white/10 bg-black/20 px-2.5 py-1 text-[11px] text-[#f3d780]">{getReviewContext(review)}</span>
              <p className="mt-4 text-lg font-semibold text-white">{review.title}</p>
              <p className="mt-3 text-sm leading-7 text-[#d5cab8]">"{review.quote}"</p>
              <div className="mt-4 text-sm text-gray-400">
                <span className="text-white">{review.authorName}</span>
                <span className="ml-2">{review.ago}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <FinalSupportCTA profileSlug={profile.slug} onMessage={openMessageModal} onFollow={handleFollow} />

      {showMessageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-[28px] border border-[#d4af37]/20 bg-[#101010] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-[#d4af37]">Message Creator</p>
                <h3 className="mt-2 text-2xl font-semibold text-white">Start a conversation with {profile.displayName}</h3>
              </div>
              <button onClick={() => setShowMessageModal(false)} className="rounded-full border border-white/10 p-2 text-gray-400 hover:text-white">×</button>
            </div>

            <div className="mt-5 grid gap-4">
              <input
                value={messageSubject}
                onChange={(event) => setMessageSubject(event.target.value)}
                placeholder="Subject"
                className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-[#d4af37]/40"
              />
              <div className="flex flex-wrap gap-2">
                {MESSAGE_INTENTS.map((intent) => (
                  <button
                    key={intent.id}
                    onClick={() => {
                      setMessageIntent(intent.id);
                      if (!messageSubject.trim()) setMessageSubject(intent.id === 'general' ? 'General inquiry' : `${intent.label} inquiry`);
                    }}
                    className={`rounded-full px-3 py-1.5 text-xs ${messageIntent === intent.id ? 'bg-[#d4af37] text-black' : 'border border-white/10 bg-black/20 text-gray-300 hover:border-[#d4af37]/30 hover:text-white'}`}
                  >
                    {intent.label}
                  </button>
                ))}
              </div>
              <textarea
                value={messageBody}
                onChange={(event) => setMessageBody(event.target.value)}
                placeholder="Tell them what you're looking for in this part of the practice."
                className="min-h-32 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-[#d4af37]/40"
              />
              {messageFeedback ? <div className="rounded-2xl border border-[#d4af37]/20 bg-[#d4af37]/10 px-4 py-3 text-sm text-[#f2ddb0]">{messageFeedback}</div> : null}
              <div className="flex justify-end gap-3">
                <button onClick={() => setShowMessageModal(false)} className="rounded-full border border-white/10 px-4 py-2 text-sm text-gray-300 hover:border-white/20 hover:text-white">Cancel</button>
                <button
                  onClick={async () => {
                    if (!messageSubject.trim() || !messageBody.trim()) {
                      setMessageFeedback('Add a subject and message body so the creator has enough context.');
                      return;
                    }
                    try {
                      setIsSendingMessage(true);
                      setMessageFeedback('');
                      await requireWalletAction('send a creator message');
                      await sendProfileMessage({ profileSlug: profile.slug, subject: messageSubject, body: messageBody, pillar, intent: messageIntent });
                      setMessageFeedback('Message sent. It now appears in the creator inbox.');
                      setMessageSubject('');
                      setMessageBody('');
                      setMessageIntent('general');
                    } catch (error) {
                      setMessageFeedback(error instanceof Error ? error.message : 'Unable to send message right now.');
                    } finally {
                      setIsSendingMessage(false);
                    }
                  }}
                  disabled={isSendingMessage}
                  className="rounded-full bg-[#d4af37] px-5 py-2 text-sm font-semibold text-black hover:bg-[#f4d370] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSendingMessage ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
