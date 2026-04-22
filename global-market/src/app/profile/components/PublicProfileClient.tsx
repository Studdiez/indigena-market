'use client';

import { useEffect, useMemo, useState } from 'react';
import { X } from 'lucide-react';
import type { CreatorProfileRecord, ProfileOffering, ProfilePillarId } from '@/app/profile/data/profileShowcase';
import { fetchPublicProfile, sendProfileMessage, toggleProfileFollow, trackProfileAnalyticsEvent } from '@/app/lib/profileApi';
import { requireWalletAction } from '@/app/lib/requireWalletAction';
import { getOfferingMerchandisingScore, shouldShowOfferingInStorefront } from '@/app/profile/lib/offeringMerchandising';
import {
  CreatorConnectionSection,
  CreatorHero,
  CrossPillarBundleCards,
  EngagementPathCards,
  FeaturedWorkGrid,
  FinalSupportCTA,
  PillarSection,
  SocialProofStrip,
  AboutPracticeSection,
  STOREFRONT_PILLAR_META
} from '@/app/components/storefront/CreatorStorefrontSections';

const MESSAGE_INTENTS = [
  { id: 'general', label: 'General' },
  { id: 'commission', label: 'Commission' },
  { id: 'booking', label: 'Booking' },
  { id: 'licensing', label: 'Licensing' },
  { id: 'wholesale', label: 'Wholesale' },
  { id: 'collaboration', label: 'Collaboration' }
] as const;

export default function PublicProfileClient({ profile: initialProfile, slug }: { profile: CreatorProfileRecord; slug: string }) {
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
    trackProfileAnalyticsEvent({ profileSlug: slug, eventName: 'storefront_view', pageKind: 'profile' });
  }, [slug]);

  const visibleOfferings = useMemo(() => {
    return profile.offerings
      .filter((offering) => shouldShowOfferingInStorefront(offering))
      .sort((a, b) => getOfferingMerchandisingScore(b) - getOfferingMerchandisingScore(a));
  }, [profile.offerings]);

  const featuredOfferings = useMemo(() => {
    const preferred = profile.presentation.featuredOfferingIds ?? [];
    const pinned = visibleOfferings.filter((offering) => preferred.includes(offering.id));
    if (pinned.length > 0) return pinned.slice(0, 4);
    return visibleOfferings.filter((offering) => offering.featured).slice(0, 4);
  }, [profile.presentation.featuredOfferingIds, visibleOfferings]);

  const groupedByPillar = useMemo(() => {
    const groups = new Map<ProfilePillarId, ProfileOffering[]>();
    for (const offering of visibleOfferings) {
      const list = groups.get(offering.pillar) ?? [];
      list.push(offering);
      groups.set(offering.pillar, list);
    }
    return Array.from(groups.entries()).filter(([pillar]) => pillar in STOREFRONT_PILLAR_META);
  }, [visibleOfferings]);

  const averageReviewRating = useMemo(() => {
    if (profile.featuredReviews.length === 0) return null;
    const total = profile.featuredReviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / profile.featuredReviews.length).toFixed(1);
  }, [profile.featuredReviews]);

  const messagePillar = featuredOfferings[0]?.pillar || visibleOfferings[0]?.pillar || 'digital-arts';

  const openMessageModal = () => {
    trackProfileAnalyticsEvent({ profileSlug: profile.slug, eventName: 'message_open', pageKind: 'profile' });
    setShowMessageModal(true);
  };

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

  const jumpToFeatured = () => {
    const target = document.getElementById('featured-work');
    if (target) {
      window.requestAnimationFrame(() => {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  };

  const trackOfferClick = (offering: ProfileOffering) => {
    trackProfileAnalyticsEvent({
      profileSlug: profile.slug,
      eventName: 'offer_open',
      pageKind: 'profile',
      offeringId: offering.id,
      metadata: { pillar: offering.pillar, href: offering.href }
    });
  };

  const trackBundleClick = (bundleId: string) => {
    trackProfileAnalyticsEvent({
      profileSlug: profile.slug,
      eventName: 'bundle_view',
      pageKind: 'profile',
      bundleId
    });
  };

  return (
    <div className="space-y-6">
      <CreatorHero
        profile={profile}
        isFollowing={isFollowing}
        averageReviewRating={averageReviewRating}
        onMessage={openMessageModal}
        onFollow={handleFollow}
        onExploreFeatured={jumpToFeatured}
      />

      <EngagementPathCards offerings={visibleOfferings} />
      <FeaturedWorkGrid offerings={featuredOfferings} onOfferClick={trackOfferClick} />
      <AboutPracticeSection profile={profile} />
      <CrossPillarBundleCards profileSlug={profile.slug} bundles={profile.bundles} onBundleClick={trackBundleClick} />

      {groupedByPillar.map(([pillar, offerings]) => (
        <PillarSection
          key={pillar}
          profileSlug={profile.slug}
          pillar={pillar}
          offerings={offerings}
          onOfferClick={trackOfferClick}
        />
      ))}

      <SocialProofStrip
        profileSlug={profile.slug}
        reviews={profile.featuredReviews}
        trustSignals={profile.trustSignals}
        averageReviewRating={averageReviewRating}
        salesCount={profile.salesCount}
      />

      <CreatorConnectionSection profile={profile} />
      <FinalSupportCTA profileSlug={profile.slug} onMessage={openMessageModal} onFollow={handleFollow} />

      {showMessageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-[28px] border border-[#d4af37]/20 bg-[#101010] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-[#d4af37]">Message Creator</p>
                <h3 className="mt-2 text-2xl font-semibold text-white">Start a conversation with {profile.displayName}</h3>
              </div>
              <button onClick={() => setShowMessageModal(false)} className="rounded-full border border-white/10 p-2 text-gray-400 hover:text-white">
                <X size={16} />
              </button>
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
                placeholder="Tell them what you're looking for: commission, collaboration, licensing, booking, or supply inquiry."
                className="min-h-32 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-[#d4af37]/40"
              />
              {messageFeedback && <div className="rounded-2xl border border-[#d4af37]/20 bg-[#d4af37]/10 px-4 py-3 text-sm text-[#f2ddb0]">{messageFeedback}</div>}
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
                      await sendProfileMessage({ profileSlug: profile.slug, subject: messageSubject, body: messageBody, pillar: messagePillar, intent: messageIntent });
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

