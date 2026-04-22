'use client';

import { useEffect, useState } from 'react';
import { CircleDollarSign, Users, HeartHandshake, Landmark } from 'lucide-react';

interface Stat {
  icon: React.ReactNode;
  prefix?: string;
  value: number;
  suffix: string;
  label: string;
  microcopy: string;
}

const stats: Stat[] = [
  { icon: <CircleDollarSign size={24} />, prefix: '$', value: 4.2, suffix: 'M', label: 'Paid to creators', microcopy: 'Direct earnings flowing back into Indigenous households and studios.' },
  { icon: <Users size={24} />, value: 3480, suffix: '', label: 'Active Indigenous artists', microcopy: 'Creators currently sharing work, services, courses, and stories on-platform.' },
  { icon: <HeartHandshake size={24} />, value: 28700, suffix: '', label: 'Supporters and buyers', microcopy: 'People collecting, learning, booking, and backing community-led projects.' },
  { icon: <Landmark size={24} />, value: 146, suffix: '', label: 'Communities represented', microcopy: 'Nations, collectives, and cultural groups visible across the ecosystem.' },
];

function AnimatedCounter({ value, suffix, prefix = '' }: { value: number; suffix: string; prefix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(num >= 10000 ? 0 : 1) + 'K';
    return num.toString();
  };

  return (
    <span className="text-3xl md:text-4xl font-bold secondary-gradient">
      {prefix}{formatNumber(count)}{suffix}
    </span>
  );
}

export default function StatsBar() {
  return (
    <section className="border-y border-[#d4af37]/20 bg-[#0f0f0f] px-6 py-10 md:py-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[#d4af37]/70">Trust and impact</p>
            <h2 className="text-xl font-semibold text-white md:text-2xl">Clear signals that value is flowing back to creators and communities.</h2>
          </div>
          <p className="max-w-xl text-sm text-gray-400">
            These numbers are here to help people understand who is on the platform and where the momentum is going, without jargon or shorthand.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={index} className="rounded-2xl border border-[#d4af37]/10 bg-[#111111] p-5">
              <div className="mb-4 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#d4af37]/10 text-[#d4af37]">
                {stat.icon}
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[#d4af37]/65">Live trust metric</p>
                  <p className="text-sm font-medium text-white">{stat.label}</p>
                </div>
              </div>
              <div>
                <AnimatedCounter value={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
                <p className="mt-2 max-w-xs text-sm leading-6 text-gray-400">{stat.microcopy}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
