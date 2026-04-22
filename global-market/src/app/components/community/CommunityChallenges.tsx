'use client';

import { useState } from 'react';
import { Trophy, Target, Clock, Users, ArrowRight, Flame, Star, Zap, Crown, Gift } from 'lucide-react';
import Link from 'next/link';

interface Challenge {
  id: string;
  title: string;
  description: string;
  image: string;
  type: 'art' | 'skill' | 'community';
  prize: string;
  prizeValue: number;
  participants: number;
  endDate: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  sponsor?: string;
  isFeatured?: boolean;
  progress?: number;
  joined?: boolean;
}

const challenges: Challenge[] = [
  {
    id: 'challenge-1',
    title: '30-Day Beadwork Challenge',
    description: 'Create a new beadwork piece every day for 30 days. Share your progress and win amazing prizes!',
    image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=600&h=300&fit=crop',
    type: 'art',
    prize: '1st Place: 1000 INDI + Featured Spot',
    prizeValue: 1000,
    participants: 456,
    endDate: '15 days left',
    difficulty: 'Medium',
    sponsor: 'Heritage Arts Foundation',
    isFeatured: true,
    progress: 45,
    joined: true
  },
  {
    id: 'challenge-2',
    title: 'Digital Art Masterpiece',
    description: 'Create digital art that blends traditional Indigenous symbols with modern aesthetics.',
    image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&h=300&fit=crop',
    type: 'art',
    prize: 'Grand Prize: 2000 INDI',
    prizeValue: 2000,
    participants: 234,
    endDate: '7 days left',
    difficulty: 'Hard',
    sponsor: 'Native Arts Council',
    isFeatured: true
  },
  {
    id: 'challenge-3',
    title: 'Community Helper Challenge',
    description: 'Help 5 new members of the community by answering their questions and providing feedback.',
    image: 'https://images.unsplash.com/photo-1549887534-1541e9326642?w=600&h=300&fit=crop',
    type: 'community',
    prize: 'Helper Badge + 500 INDI',
    prizeValue: 500,
    participants: 189,
    endDate: 'Ongoing',
    difficulty: 'Easy'
  },
  {
    id: 'challenge-4',
    title: 'Language Preservation',
    description: 'Learn and share 10 words in an endangered Indigenous language. Record pronunciation!',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=300&fit=crop',
    type: 'skill',
    prize: 'Cultural Keeper Badge + 750 INDI',
    prizeValue: 750,
    participants: 312,
    endDate: '21 days left',
    difficulty: 'Medium',
    sponsor: 'Tribal Education Initiative'
  }
];

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Easy': return 'text-green-400 bg-green-500/10';
    case 'Medium': return 'text-yellow-400 bg-yellow-500/10';
    case 'Hard': return 'text-red-400 bg-red-500/10';
    default: return 'text-gray-400 bg-gray-500/10';
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'art': return <Star size={14} />;
    case 'skill': return <Zap size={14} />;
    case 'community': return <Users size={14} />;
    default: return <Target size={14} />;
  }
};

export default function CommunityChallenges() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'art' | 'skill' | 'community'>('all');
  const [joinedChallenges, setJoinedChallenges] = useState<Set<string>>(new Set(['challenge-1']));

  const filteredChallenges = challenges.filter((challenge) =>
    activeFilter === 'all' || challenge.type === activeFilter
  );
  const featuredChallenge = filteredChallenges.find((challenge) => challenge.isFeatured) || filteredChallenges[0];
  const supportingChallenges = filteredChallenges.filter((challenge) => challenge.id !== featuredChallenge?.id);

  const handleJoin = (challengeId: string) => {
    setJoinedChallenges((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(challengeId)) {
        newSet.delete(challengeId);
      } else {
        newSet.add(challengeId);
      }
      return newSet;
    });
  };

  return (
    <div className="mb-8">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#d4af37] via-[#f4e4a6] to-[#b8941f]">
            <Trophy size={18} className="text-black" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Community Challenges</h3>
            <p className="text-xs text-gray-400">Compete, participate, and win visibility or rewards</p>
          </div>
        </div>
        <Link
          href="/community?view=challenges"
          className="flex items-center gap-1 text-sm text-[#d4af37] transition-colors hover:text-[#f4e4a6]"
        >
          View all
          <ArrowRight size={14} />
        </Link>
      </div>

      <div className="mb-4 flex items-center gap-2">
        {(['all', 'art', 'skill', 'community'] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium capitalize transition-all ${
              activeFilter === filter
                ? 'bg-[#d4af37] text-black'
                : 'border border-[#d4af37]/20 bg-[#141414] text-gray-400 hover:text-white'
            }`}
          >
            {filter === 'all' ? 'All' : filter}
          </button>
        ))}
      </div>

      {featuredChallenge ? (
        <div className="mb-5 overflow-hidden rounded-2xl border border-[#d4af37]/35 bg-gradient-to-br from-[#1b1408] via-[#141414] to-[#101010] shadow-[0_18px_52px_rgba(0,0,0,0.26)]">
          <div className="grid gap-0 lg:grid-cols-[1.1fr,0.9fr]">
            <div className="relative min-h-[260px] overflow-hidden">
              <img src={featuredChallenge.image} alt={featuredChallenge.title} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/92 via-[#0a0a0a]/55 to-transparent" />
              <div className="absolute left-5 top-5 flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1 rounded-full bg-[#d4af37] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-black">
                  <Crown size={10} />
                  Featured Challenge
                </div>
                {featuredChallenge.sponsor ? (
                  <div className="rounded-full border border-[#d4af37]/25 bg-black/35 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-[#d4af37]">
                    Sponsored challenge
                  </div>
                ) : null}
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="text-xs uppercase tracking-[0.22em] text-[#d4af37]">Participation spotlight</p>
                <h4 className="mt-2 max-w-xl text-2xl font-bold text-white">{featuredChallenge.title}</h4>
                <p className="mt-3 max-w-xl text-sm text-gray-300">{featuredChallenge.description}</p>
              </div>
            </div>
            <div className="flex flex-col justify-between p-5">
              <div>
                {featuredChallenge.sponsor ? (
                  <p className="text-xs uppercase tracking-[0.18em] text-[#d4af37]/75">Sponsored by {featuredChallenge.sponsor}</p>
                ) : null}
                <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                  <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-gray-500">Reward</p>
                    <p className="mt-2 text-sm font-semibold text-[#d4af37]">{featuredChallenge.prize}</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-gray-500">Participants</p>
                    <p className="mt-2 text-lg font-semibold text-white">{featuredChallenge.participants}</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-gray-500">Ends in</p>
                    <p className="mt-2 text-lg font-semibold text-white">{featuredChallenge.endDate}</p>
                  </div>
                </div>
                {featuredChallenge.progress ? (
                  <div className="mt-4">
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="text-gray-400">Your progress</span>
                      <span className="text-[#d4af37]">{featuredChallenge.progress}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-gray-800">
                      <div className="h-full rounded-full bg-gradient-to-r from-[#d4af37] to-[#b8941f]" style={{ width: `${featuredChallenge.progress}%` }} />
                    </div>
                  </div>
                ) : null}
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  onClick={() => handleJoin(featuredChallenge.id)}
                  className={`rounded-lg px-4 py-2 font-medium transition-all ${
                    joinedChallenges.has(featuredChallenge.id)
                      ? 'border border-green-500/30 bg-green-500/20 text-green-400'
                      : 'bg-gradient-to-r from-[#d4af37] to-[#b8941f] text-black hover:shadow-lg hover:shadow-[#d4af37]/30'
                  }`}
                >
                  {joinedChallenges.has(featuredChallenge.id) ? 'Joined ✓' : 'Join Featured Challenge'}
                </button>
                <Link
                  href="/creator-hub"
                  className="rounded-lg border border-[#d4af37]/30 px-4 py-2 text-sm text-[#d4af37] transition-colors hover:bg-[#d4af37]/10"
                >
                  Sponsor a challenge
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {supportingChallenges.map((challenge) => (
          <div
            key={challenge.id}
            className={`group relative overflow-hidden rounded-xl border bg-[#141414] transition-all ${
              challenge.isFeatured ? 'border-[#d4af37]/40' : 'border-[#d4af37]/10'
            } hover:border-[#d4af37]/30`}
          >
            {challenge.isFeatured ? (
              <div className="absolute top-3 left-3 z-10 flex items-center gap-1 rounded bg-[#d4af37] px-2 py-1 text-xs font-bold text-black">
                <Crown size={10} />
                FEATURED
              </div>
            ) : null}

            <div className="relative h-32 overflow-hidden">
              <img src={challenge.image} alt={challenge.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#141414] to-transparent" />
              <div className="absolute top-3 right-3 flex items-center gap-1 rounded bg-black/50 px-2 py-1 text-xs text-white backdrop-blur-sm">
                {getTypeIcon(challenge.type)}
                <span className="capitalize">{challenge.type}</span>
              </div>
              <div className={`absolute bottom-3 left-3 rounded px-2 py-1 text-xs font-medium ${getDifficultyColor(challenge.difficulty)}`}>
                {challenge.difficulty}
              </div>
            </div>

            <div className="p-4">
              {challenge.sponsor ? (
                <p className="mb-1 text-xs text-[#d4af37]/70">Sponsored by {challenge.sponsor}</p>
              ) : null}

              <h4 className="mb-2 font-semibold text-white transition-colors group-hover:text-[#d4af37]">{challenge.title}</h4>
              <p className="mb-3 line-clamp-2 text-sm text-gray-400">{challenge.description}</p>

              {joinedChallenges.has(challenge.id) && challenge.progress ? (
                <div className="mb-3">
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-gray-400">Your Progress</span>
                    <span className="text-[#d4af37]">{challenge.progress}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-gray-700">
                    <div className="h-full rounded-full bg-gradient-to-r from-[#d4af37] to-[#b8941f]" style={{ width: `${challenge.progress}%` }} />
                  </div>
                </div>
              ) : null}

              <div className="mb-3 flex items-center gap-2 rounded-lg bg-[#d4af37]/5 p-2">
                <Gift size={16} className="text-[#d4af37]" />
                <span className="text-sm text-[#d4af37]">{challenge.prize}</span>
              </div>

              <div className="mb-3 flex items-center justify-between text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <Users size={12} />
                  {challenge.participants} joined
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {challenge.endDate}
                </span>
              </div>

              <button
                onClick={() => handleJoin(challenge.id)}
                className={`w-full rounded-lg py-2 font-medium transition-all ${
                  joinedChallenges.has(challenge.id)
                    ? 'border border-green-500/30 bg-green-500/20 text-green-400'
                    : 'bg-gradient-to-r from-[#d4af37] to-[#b8941f] text-black hover:shadow-lg hover:shadow-[#d4af37]/30'
                }`}
              >
                {joinedChallenges.has(challenge.id) ? 'Joined ✓' : 'Join Challenge'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-xl border border-[#d4af37]/20 bg-gradient-to-r from-[#d4af37]/10 via-[#141414] to-[#DC143C]/10 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#d4af37]/20">
              <Flame size={20} className="text-[#d4af37]" />
            </div>
            <div>
              <p className="font-medium text-white">Create a Challenge</p>
              <p className="text-sm text-gray-400">Engage your community with missions, visibility, and rewards</p>
            </div>
          </div>
          <Link
            href="/community?view=challenges&action=create"
            className="rounded-lg border border-[#d4af37] bg-[#d4af37]/20 px-4 py-2 text-sm font-medium text-[#d4af37] transition-colors hover:bg-[#d4af37]/30"
          >
            Create Challenge
          </Link>
        </div>
      </div>
    </div>
  );
}
