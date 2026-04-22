'use client';

import { Play, Quote, Users, Heart, MessageCircle, Share2 } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Story {
  id: string;
  type: 'testimonial' | 'heritage' | 'video';
  author: string;
  avatar: string;
  role: string;
  nation: string;
  content: string;
  image?: string;
  videoThumbnail?: string;
  likes: number;
  comments: number;
  featured: boolean;
}

const stories: Story[] = [
  {
    id: '1',
    type: 'testimonial',
    author: 'Maria Redfeather',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    role: 'Digital Artist',
    nation: 'Lakota Nation',
    content: 'Indigena Market has transformed how I share my art. For the first time, I can reach a global audience while maintaining control over my cultural stories. The ongoing royalties mean my family benefits from every resale.',
    likes: 234,
    comments: 18,
    featured: true
  },
  {
    id: '2',
    type: 'heritage',
    author: 'Eagle Rising',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    role: 'Cultural Educator',
    nation: 'Navajo Nation',
    content: 'Through this platform, we are preserving our oral traditions. Each NFT comes with the artist voice story - a piece of our living culture that will never be lost.',
    image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&h=400&fit=crop',
    likes: 456,
    comments: 32,
    featured: false
  },
  {
    id: '3',
    type: 'video',
    author: 'Thunder Voice',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    role: 'Traditional Weaver',
    nation: 'Hopi Tribe',
    content: 'Watch how our traditional weaving techniques are being preserved and shared through digital art.',
    videoThumbnail: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=600&h=400&fit=crop',
    likes: 892,
    comments: 67,
    featured: true
  }
];

export default function CommunityStories() {
  const router = useRouter();
  const [likedStories, setLikedStories] = useState<Set<string>>(new Set());
  const leadStory = stories[0];
  const supportingStories = stories.slice(1);

  const toggleLike = (id: string) => {
    setLikedStories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const handleShare = async (story: Story) => {
    const shareUrl = `${window.location.origin}/community?view=stories&story=${story.id}`;
    if (navigator.share) {
      await navigator.share({
        title: `${story.author} on Indigena Market`,
        text: story.content,
        url: shareUrl
      }).catch(() => undefined);
      return;
    }
    await navigator.clipboard.writeText(shareUrl).catch(() => undefined);
  };

  return (
    <section className="py-12 px-6 bg-gradient-to-b from-[#0f0f0f] to-[#0a0a0a]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#d4af37]/10 rounded-full border border-[#d4af37]/20 mb-4">
            <Users size={16} className="text-[#d4af37]" />
            <span className="text-[#d4af37] text-sm font-medium">Community Voices</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Stories from Our <span className="secondary-gradient">Community</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Hear from Indigenous artists and cultural guardians about how Indigena Market is preserving and sharing their heritage.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.12fr_0.88fr]">
          <div className="group overflow-hidden rounded-[26px] border border-[#d4af37]/18 bg-[#141414] shadow-[0_18px_60px_rgba(0,0,0,0.32)] transition-all hover:border-[#d4af37]/35 hover:shadow-[#d4af37]/8">
            <div className="relative h-[360px] overflow-hidden">
              <img
                src={leadStory.image ?? leadStory.avatar}
                alt={leadStory.author}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090909] via-black/45 to-transparent" />
              <div className="absolute left-6 top-6 flex items-center gap-2">
                <div className="rounded-full border border-[#d4af37]/40 bg-[#0b0b0b]/75 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#f3d57c] backdrop-blur-sm">
                  Community spotlight
                </div>
                <div className="rounded-full bg-[#DC143C] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white">
                  Featured voice
                </div>
              </div>
              <div className="absolute bottom-6 left-6 right-6">
                <div className="max-w-2xl rounded-2xl border border-white/10 bg-black/35 p-5 backdrop-blur-sm">
                  <div className="mb-4 flex items-center gap-3">
                    <img
                      src={leadStory.avatar}
                      alt={leadStory.author}
                      className="h-14 w-14 rounded-full border-2 border-[#d4af37]/30 object-cover"
                    />
                    <div>
                      <h4 className="text-lg font-semibold text-white">{leadStory.author}</h4>
                      <p className="text-sm text-[#d4af37]">{leadStory.role}</p>
                      <p className="text-xs text-gray-400">{leadStory.nation}</p>
                    </div>
                  </div>
                  <div className="relative">
                    <Quote size={28} className="absolute -left-1 -top-2 text-[#d4af37]/30" />
                    <p className="pl-7 text-base leading-8 text-gray-200">{leadStory.content}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-[#d4af37]/10 px-6 py-4">
              <div className="flex items-center gap-5">
                <button
                  onClick={() => toggleLike(leadStory.id)}
                  className={`flex items-center gap-1.5 transition-colors ${
                    likedStories.has(leadStory.id) ? 'text-[#DC143C]' : 'text-gray-400 hover:text-[#DC143C]'
                  }`}
                >
                  <Heart size={16} fill={likedStories.has(leadStory.id) ? '#DC143C' : 'none'} />
                  <span className="text-sm">{leadStory.likes + (likedStories.has(leadStory.id) ? 1 : 0)}</span>
                </button>
                <button
                  type="button"
                  onClick={() => router.push(`/community?view=stories&story=${leadStory.id}`)}
                  className="flex items-center gap-1.5 text-gray-400 transition-colors hover:text-[#d4af37]"
                >
                  <MessageCircle size={16} />
                  <span className="text-sm">{leadStory.comments}</span>
                </button>
              </div>
              <button
                type="button"
                onClick={() => handleShare(leadStory)}
                className="text-gray-400 transition-colors hover:text-[#d4af37]"
              >
                <Share2 size={16} />
              </button>
            </div>
          </div>

          <div className="grid gap-4">
            {supportingStories.map((story) => (
              <div
                key={story.id}
                className="group overflow-hidden rounded-2xl border border-[#d4af37]/10 bg-[#141414] transition-all hover:border-[#d4af37]/30 hover:shadow-xl hover:shadow-[#d4af37]/5"
              >
                {(story.type === 'video' && story.videoThumbnail) || (story.type === 'heritage' && story.image) ? (
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={story.type === 'video' ? story.videoThumbnail : story.image}
                      alt={story.author}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent" />
                    {story.type === 'video' ? (
                      <>
                        <div className="absolute inset-0 flex items-center justify-center bg-black/28">
                          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#d4af37] shadow-lg shadow-[#d4af37]/30 transition-transform group-hover:scale-110">
                            <Play size={28} className="ml-1 text-black" fill="black" />
                          </div>
                        </div>
                        <div className="absolute left-3 top-3 rounded-full bg-[#DC143C] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-white">
                          Video story
                        </div>
                      </>
                    ) : (
                      <div className="absolute left-3 top-3 rounded-full bg-[#d4af37] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-black">
                        Heritage story
                      </div>
                    )}
                  </div>
                ) : null}

                <div className="p-5">
                  <div className="mb-4 flex items-center gap-3">
                    <img
                      src={story.avatar}
                      alt={story.author}
                      className="h-12 w-12 rounded-full border-2 border-[#d4af37]/30 object-cover"
                    />
                    <div>
                      <h4 className="font-semibold text-white">{story.author}</h4>
                      <p className="text-sm text-[#d4af37]">{story.role}</p>
                      <p className="text-xs text-gray-500">{story.nation}</p>
                    </div>
                  </div>

                  <p className="mb-4 text-sm leading-7 text-gray-300">{story.content}</p>

                  <div className="flex items-center justify-between border-t border-[#d4af37]/10 pt-4">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => toggleLike(story.id)}
                        className={`flex items-center gap-1.5 transition-colors ${
                          likedStories.has(story.id) ? 'text-[#DC143C]' : 'text-gray-400 hover:text-[#DC143C]'
                        }`}
                      >
                        <Heart size={16} fill={likedStories.has(story.id) ? '#DC143C' : 'none'} />
                        <span className="text-sm">{story.likes + (likedStories.has(story.id) ? 1 : 0)}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => router.push(`/community?view=stories&story=${story.id}`)}
                        className="flex items-center gap-1.5 text-gray-400 transition-colors hover:text-[#d4af37]"
                      >
                        <MessageCircle size={16} />
                        <span className="text-sm">{story.comments}</span>
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleShare(story)}
                      className="text-gray-400 transition-colors hover:text-[#d4af37]"
                    >
                      <Share2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <button
            type="button"
            onClick={() => router.push('/community?view=stories&action=share')}
            className="px-8 py-3 bg-[#d4af37]/10 border border-[#d4af37]/30 rounded-full text-[#d4af37] font-medium hover:bg-[#d4af37] hover:text-black transition-all"
          >
            Share Your Story
          </button>
        </div>
      </div>
    </section>
  );
}
