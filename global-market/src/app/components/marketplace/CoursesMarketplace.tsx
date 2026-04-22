'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { 
  GraduationCap, 
  Search, 
  Filter, 
  Clock, 
  Users, 
  Star, 
  BookOpen,
  Play,
  Award,
  ChevronDown,
  Grid3X3,
  List,
  Heart,
  Share2,
  Flag,
  X,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';
import FeaturedBanner from './FeaturedBanner';
import CoursesStickyBanner from './CoursesStickyBanner';
import PillarArtistSpotlight from './PillarArtistSpotlight';
import PromotedCourses from './PromotedCourses';
import InstructorSpotlight from './InstructorSpotlight';
import BundlePromotions from './BundlePromotions';
import CommunityMarketplaceCard from '@/app/components/community/CommunityMarketplaceCard';
import { PILLAR3_CATEGORIES } from '../../courses/data/pillar3Catalog';
import {
  fetchCoursesCatalog,
  enrollInCourse,
  createCoursePaymentIntent,
  confirmCoursePayment,
  toggleCourseWatchlist,
  shareCourse,
  reportCourse,
  type CourseRecord
} from '../../lib/coursesMarketplaceApi';
import { fetchCommunityMarketplaceOffers, type CommunityMarketplaceOffer } from '@/app/lib/communityMarketplaceApi';
import { requireWalletAction } from '../../lib/requireWalletAction';
import { getMarketplaceCardMerchandising } from './marketplaceCardMerchandising';

// Course categories
const courseCategories = [
  { id: 'all', name: 'All Courses', color: '#d4af37', iconEmoji: '🪶' },
  ...PILLAR3_CATEGORIES.map((category) => ({
    id: category.id,
    name: category.name,
    color: category.color,
    iconEmoji: category.iconEmoji
  }))
];

// Mock courses data
const courses = [
  {
    id: '1',
    title: 'Navajo Weaving Masterclass',
    instructor: 'Maria Begay',
    instructorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=600&h=340&fit=crop',
    category: 'traditional_arts',
    price: 149,
    originalPrice: 199,
    currency: 'INDI',
    duration: '6 weeks',
    lessons: 24,
    students: 1234,
    rating: 4.9,
    reviews: 89,
    level: 'Beginner',
    verification: 'Platinum',
    description: 'Learn the sacred art of Navajo weaving from a master artisan. Includes traditional patterns, dyeing techniques, and cultural significance.',
    tags: ['Weaving', 'Textiles', 'Traditional'],
    isFeatured: true
  },
  {
    id: '2',
    title: 'Lakota Language Fundamentals',
    instructor: 'Dr. Sarah Whitehorse',
    instructorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=340&fit=crop',
    category: 'language_learning',
    price: 199,
    currency: 'INDI',
    duration: '8 weeks',
    lessons: 32,
    students: 892,
    rating: 4.8,
    reviews: 156,
    level: 'Beginner',
    verification: 'Gold',
    description: 'Comprehensive Lakota language course with audio pronunciation, conversational practice, and cultural context.',
    tags: ['Language', 'Lakota', 'Preservation'],
    isFeatured: false
  },
  {
    id: '3',
    title: 'Traditional Pottery Techniques',
    instructor: 'Aiyana Yazzie',
    instructorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&h=340&fit=crop',
    category: 'traditional_arts',
    price: 129,
    currency: 'INDI',
    duration: '4 weeks',
    lessons: 16,
    students: 567,
    rating: 4.7,
    reviews: 78,
    level: 'Intermediate',
    verification: 'Gold',
    description: 'Hand-building and firing techniques passed down through generations. Learn to create traditional pottery with authentic methods.',
    tags: ['Pottery', 'Ceramics', 'Traditional'],
    isFeatured: false
  },
  {
    id: '4',
    title: 'Indigenous Entrepreneurship',
    instructor: 'Michael Thunderbird',
    instructorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&h=340&fit=crop',
    category: 'business_entrepreneurship',
    price: 249,
    currency: 'INDI',
    duration: '10 weeks',
    lessons: 40,
    students: 445,
    rating: 4.9,
    reviews: 67,
    level: 'Advanced',
    verification: 'Platinum',
    description: 'Build a successful Indigenous-owned business while honoring cultural values. Marketing, finance, and community engagement.',
    tags: ['Business', 'Entrepreneurship', 'Marketing'],
    isFeatured: true
  },
  {
    id: '5',
    title: 'Beadwork Fundamentals',
    instructor: 'Lena Crow',
    instructorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=600&h=340&fit=crop',
    category: 'traditional_arts',
    price: 89,
    currency: 'INDI',
    duration: '3 weeks',
    lessons: 12,
    students: 2134,
    rating: 4.8,
    reviews: 234,
    level: 'Beginner',
    verification: 'Silver',
    description: 'Start your beadwork journey with fundamental stitches, pattern reading, and design principles.',
    tags: ['Beadwork', 'Jewelry', 'Beginner'],
    isFeatured: false
  },
  {
    id: '6',
    title: 'Sustainable Agriculture Practices',
    instructor: 'Thomas Greenfield',
    instructorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&h=340&fit=crop',
    category: 'land_environment',
    price: 179,
    currency: 'INDI',
    duration: '6 weeks',
    lessons: 18,
    students: 678,
    rating: 4.6,
    reviews: 45,
    level: 'Intermediate',
    verification: 'Gold',
    description: 'Traditional Indigenous farming methods combined with modern sustainable practices. Seed saving, companion planting, and land stewardship.',
    tags: ['Agriculture', 'Sustainability', 'Farming'],
    isFeatured: false
  }
];

// Additional courses for "Load More"
const additionalCourses = [
  {
    id: '7',
    title: 'Digital Art for Indigenous Artists',
    instructor: 'Alex Rivera',
    instructorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&h=340&fit=crop',
    category: 'contemporary_art_design',
    price: 199,
    currency: 'INDI',
    duration: '5 weeks',
    lessons: 20,
    students: 892,
    rating: 4.7,
    reviews: 123,
    level: 'Beginner',
    verification: 'Gold',
    description: 'Learn digital art techniques while incorporating traditional Indigenous design elements. Photoshop, Procreate, and cultural symbolism.',
    tags: ['Digital Art', 'Design', 'Technology'],
    isFeatured: false
  },
  {
    id: '8',
    title: 'Cedar Bark Basket Weaving',
    instructor: 'Grace Williams',
    instructorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=600&h=340&fit=crop',
    category: 'traditional_arts',
    price: 159,
    currency: 'INDI',
    duration: '4 weeks',
    lessons: 16,
    students: 445,
    rating: 4.9,
    reviews: 89,
    level: 'Intermediate',
    verification: 'Platinum',
    description: 'Traditional cedar bark harvesting, preparation, and weaving techniques. Create functional and decorative baskets.',
    tags: ['Weaving', 'Basketry', 'Traditional'],
    isFeatured: false
  },
  {
    id: '9',
    title: 'Indigenous Rights & Advocacy',
    instructor: 'Dr. James Morrison',
    instructorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&h=340&fit=crop',
    category: 'advocacy_organizing',
    price: 299,
    currency: 'INDI',
    duration: '8 weeks',
    lessons: 32,
    students: 1234,
    rating: 4.8,
    reviews: 234,
    level: 'Advanced',
    verification: 'Gold',
    description: 'Understanding Indigenous rights, treaty law, and effective advocacy strategies. Learn to protect your community and culture.',
    tags: ['Advocacy', 'Law', 'Rights'],
    isFeatured: false
  },
  {
    id: '10',
    title: 'Traditional Drumming & Songs',
    instructor: 'David Thunderbird',
    instructorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=600&h=340&fit=crop',
    category: 'performing_arts',
    price: 129,
    currency: 'INDI',
    duration: '4 weeks',
    lessons: 12,
    students: 2156,
    rating: 4.9,
    reviews: 445,
    level: 'Beginner',
    verification: 'Silver',
    description: 'Learn traditional drumming techniques, song structures, and the cultural significance of music in ceremony and celebration.',
    tags: ['Music', 'Drumming', 'Tradition'],
    isFeatured: false
  },
  {
    id: '11',
    title: 'Native Plant Medicine',
    instructor: 'Sarah Wildflower',
    instructorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=600&h=340&fit=crop',
    category: 'health_wellness',
    price: 249,
    currency: 'INDI',
    duration: '10 weeks',
    lessons: 30,
    students: 1567,
    rating: 4.8,
    reviews: 312,
    level: 'Intermediate',
    verification: 'Gold',
    description: 'Identify, harvest, and prepare traditional medicines. Learn ethical harvesting practices and preparation techniques.',
    tags: ['Medicine', 'Plants', 'Healing'],
    isFeatured: false
  },
  {
    id: '12',
    title: 'Social Media for Indigenous Creators',
    instructor: 'Maya Johnson',
    instructorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&h=340&fit=crop',
    category: 'business_entrepreneurship',
    price: 149,
    currency: 'INDI',
    duration: '3 weeks',
    lessons: 15,
    students: 3421,
    rating: 4.6,
    reviews: 567,
    level: 'Beginner',
    verification: 'Silver',
    description: 'Build your online presence while maintaining cultural authenticity. Platform strategies, content creation, and community building.',
    tags: ['Social Media', 'Marketing', 'Digital'],
    isFeatured: false
  }
];

// Learning paths
const learningPaths = [
  {
    id: '1',
    title: 'Beginner Path',
    courses: 5,
    duration: '8 weeks',
    level: 'Foundational',
    description: 'Start with gentle entry points, short practice loops, and confidence-building courses.',
    image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400&h=200&fit=crop'
  },
  {
    id: '2',
    title: 'Language Immersion',
    courses: 6,
    duration: '8 months',
    level: 'Deep study',
    description: 'Move from fundamentals into speaking, listening, and cultural context with teacher-led structure.',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=200&fit=crop'
  },
  {
    id: '3',
    title: 'Cultural Arts',
    courses: 5,
    duration: '10 weeks',
    level: 'Practice-based',
    description: 'Learn through art, making, and process with courses rooted in craft, pattern, and visual storytelling.',
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400&h=200&fit=crop'
  },
  {
    id: '4',
    title: 'Land & Knowledge',
    courses: 4,
    duration: '6 weeks',
    level: 'Immersive',
    description: 'Follow teachings connected to stewardship, ecology, food systems, and seasonal knowledge.',
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&h=200&fit=crop'
  },
  {
    id: '5',
    title: 'Professional / Business',
    courses: 6,
    duration: '12 months',
    level: 'All Levels',
    description: 'Build practical skills for leadership, entrepreneurship, communication, and Indigenous economic growth.',
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400&h=200&fit=crop'
  }
];

const featuredJourney = {
  title: 'This month’s journey',
  name: 'Learn Navajo weaving from first pattern to advanced practice',
  description:
    'A guided multi-course path that begins with foundational beadwork and weaving literacy, then moves into advanced technique, symbolism, and material preparation.',
  steps: [
    { id: 'journey-step-1', label: 'Begin', title: 'Beadwork Fundamentals', detail: 'Build hand rhythm, pattern reading, and visual confidence.', outcome: 'Leave with a grounded first practice.' },
    { id: 'journey-step-2', label: 'Build', title: 'Navajo Weaving Masterclass', detail: 'Learn structure, pattern systems, and the cultural logic behind design.', outcome: 'Understand both technique and context.' },
    { id: 'journey-step-3', label: 'Deepen', title: 'Advanced Navajo Weaving Techniques', detail: 'Move into extended study, complexity, and more precise material control.', outcome: 'Progress toward full creative independence.' }
  ],
  support: 'Optional materials and kits pair naturally with this journey for a fuller learning experience.'
};

// Stats
const platformStats = {
  totalCourses: 156,
  activeStudents: 12543,
  indigenousInstructors: 89,
  certificatesIssued: 3421
};

// Verification badges
const verificationBadges = {
  Bronze: { color: '#CD7F32', label: 'Bronze' },
  Silver: { color: '#C0C0C0', label: 'Silver' },
  Gold: { color: '#FFD700', label: 'Gold' },
  Platinum: { color: '#E5E4E2', label: 'Platinum' }
};

const MOCK_COURSE_CATALOG = [...courses, ...additionalCourses];

const levelLabel = (level?: string) => {
  if (!level) return 'Beginner';
  if (level === 'beginner') return 'Beginner';
  if (level === 'intermediate') return 'Intermediate';
  if (level === 'advanced') return 'Advanced';
  return 'All Levels';
};

const verifyTier = (rating?: number) => {
  const score = Number(rating || 0);
  if (score >= 4.8) return 'Platinum';
  if (score >= 4.5) return 'Gold';
  if (score >= 4.1) return 'Silver';
  return 'Bronze';
};

const getCourseFormatLabel = (course: { category: string; duration: string; level: string }) => {
  if (course.category === 'language_learning') return 'Language immersion';
  if (course.category === 'traditional_arts' || course.category === 'performing_arts') return 'Skill-based';
  if (course.category === 'cultural_knowledge' || course.category === 'land_environment') return 'Land & knowledge';
  if (course.category === 'business_entrepreneurship' || course.category === 'professional_development') return 'Professional growth';
  if (parseInt(course.duration, 10) >= 8) return 'Deep study';
  if (parseInt(course.duration, 10) <= 4) return 'Short course';
  if (course.level === 'Advanced') return 'Full program';
  return 'Guided course';
};

const getCourseOutcome = (course: { title: string; category: string }) => {
  if (course.category === 'language_learning') return 'Gain speaking confidence with foundational vocabulary and cultural context.';
  if (course.category === 'traditional_arts') return 'Understand pattern systems, material discipline, and the first steps of traditional craft mastery.';
  if (course.category === 'business_entrepreneurship') return 'Build a practical plan you can use to grow an Indigenous-led practice or business.';
  if (course.category === 'land_environment') return 'Strengthen land-based knowledge you can apply through stewardship and seasonal practice.';
  if (course.category === 'advocacy_organizing') return 'Leave with practical tools for community protection, rights literacy, and public action.';
  return `Learn through ${course.title.toLowerCase()} with clearer practice goals and takeaways.`;
};

const mapApiCourseToMarketplace = (course: CourseRecord) => {
  const id = String(course.courseId || course._id || `course-${Date.now()}`);
  const rating = Number(course.averageRating || 0);
  const minutes = Number(course.estimatedDuration || 0);
  const weeks = minutes > 0 ? Math.max(1, Math.round(minutes / (60 * 4))) : 4;
  const price = Number(course.pricing?.amount || 0);
  const learners = Array.isArray(course.enrollments) ? course.enrollments.length : Math.max(0, Math.round(rating * 100));
  return {
    id,
    title: course.title || 'Untitled Course',
    instructor: (course.creatorAddress || 'Indigenous Educator').slice(0, 16),
    instructorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    thumbnail: course.thumbnailUrl || 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=340&fit=crop',
    category: course.categoryId || course.category || 'traditional_arts',
    price,
    currency: course.pricing?.currency || 'INDI',
    duration: `${weeks} weeks`,
    lessons: Math.max(1, Math.round(minutes / 30) || 12),
    students: learners,
    rating: rating || 4.5,
    reviews: Math.max(0, Math.round(learners * 0.1)),
    level: levelLabel(course.skillLevel),
    verification: verifyTier(rating),
    description: course.description || 'Open the course page for the instructor overview and enrollment details.',
    tags: Array.isArray(course.tags) && course.tags.length > 0 ? course.tags.slice(0, 3) : ['Culture', 'Learning'],
    isFeatured: rating >= 4.7
  };
};

// â”€â”€ Course Detail Modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function CourseDetailModal({
  course,
  onClose,
  onEnroll,
  onReport
}: {
  course: typeof courses[0];
  onClose: () => void;
  onEnroll: (courseId: string) => Promise<{ receiptId?: string; amount?: number; currency?: string } | null>;
  onReport: (courseId: string, reason: string, details?: string) => Promise<void>;
}) {
  const [enrolled, setEnrolled] = useState(false);
  const [enrollPending, setEnrollPending] = useState(false);
  const [enrollError, setEnrollError] = useState<string | null>(null);
  const [receiptId, setReceiptId] = useState('');
  const [reportPending, setReportPending] = useState(false);
  const [reportState, setReportState] = useState<'idle' | 'success' | 'error'>('idle');
  const badge = verificationBadges[course.verification as keyof typeof verificationBadges];
  const merch = getMarketplaceCardMerchandising({
    title: course.title,
    pillarLabel: 'Courses',
    image: course.thumbnail,
    coverImage: course.thumbnail,
    galleryOrder: [course.thumbnail],
    ctaMode: 'enroll',
    ctaPreset: 'enroll-now',
    availabilityLabel: 'Open enrollment',
    availabilityTone: 'success',
    featured: Boolean(course.isFeatured),
    merchandisingRank: course.isFeatured ? 2 : 10,
    status: 'Active',
    priceLabel: `${course.price} ${course.currency}`,
    blurb: course.description,
  });
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg bg-[#141414] border border-[#d4af37]/20 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative h-48 overflow-hidden flex-shrink-0">
          <img src={merch.image} alt={course.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/30 to-transparent" />
          <button onClick={onClose} className="absolute top-3 right-3 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-black/80">
            <X size={16} />
          </button>
          {course.isFeatured && (
            <div className="absolute top-3 left-3 px-2 py-1 bg-[#d4af37] text-black text-xs font-bold rounded">Featured</div>
          )}
          <div className="absolute bottom-3 left-4 right-16">
            <p className="text-white font-bold text-lg leading-tight">{course.title}</p>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto flex-1">
          {enrolled ? (
            <div className="flex flex-col items-center gap-3 py-8">
              <div className="w-16 h-16 bg-[#d4af37]/20 border border-[#d4af37]/40 rounded-full flex items-center justify-center">
                <CheckCircle size={32} className="text-[#d4af37]" />
              </div>
              <p className="text-white font-bold text-xl">Enrolled!</p>
              <p className="text-gray-400 text-sm text-center">You&apos;re now enrolled in <span className="text-[#d4af37]">{course.title}</span>. Check your dashboard to start learning.</p>
              {receiptId && <p className="text-xs text-[#d4af37]/90">Receipt: {receiptId}</p>}
            </div>
          ) : (
            <>
              {/* Instructor */}
              <div className="flex items-center gap-3 mb-4">
                <img src={course.instructorAvatar} alt={course.instructor} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="text-white font-medium text-sm">{course.instructor}</p>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: badge.color + '30', color: badge.color }}>{badge.label}</span>
                    <span className="text-gray-500 text-xs">{course.level}</span>
                  </div>
                </div>
                <div className="ml-auto flex items-center gap-1">
                  <Star size={14} className="text-[#d4af37] fill-[#d4af37]" />
                  <span className="text-white font-medium text-sm">{course.rating}</span>
                  <span className="text-gray-500 text-xs">({course.reviews})</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-400 text-sm mb-4">{course.description}</p>

              {/* Stats grid */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="p-3 bg-[#0a0a0a] rounded-lg text-center">
                  <Clock size={14} className="text-[#d4af37] mx-auto mb-1" />
                  <p className="text-white text-sm font-medium">{course.duration}</p>
                  <p className="text-gray-500 text-xs">Duration</p>
                </div>
                <div className="p-3 bg-[#0a0a0a] rounded-lg text-center">
                  <BookOpen size={14} className="text-[#d4af37] mx-auto mb-1" />
                  <p className="text-white text-sm font-medium">{course.lessons}</p>
                  <p className="text-gray-500 text-xs">Lessons</p>
                </div>
                <div className="p-3 bg-[#0a0a0a] rounded-lg text-center">
                  <Users size={14} className="text-[#d4af37] mx-auto mb-1" />
                  <p className="text-white text-sm font-medium">{course.students.toLocaleString()}</p>
                  <p className="text-gray-500 text-xs">Students</p>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-5">
                {course.tags.map(t => <span key={t} className="text-xs text-[#d4af37]/80">#{t}</span>)}
              </div>

              {/* Price + CTA */}
              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div>
                  <p className="text-[#d4af37] font-bold text-2xl">{course.price} <span className="text-base">INDI</span></p>
                  {course.originalPrice && <p className="text-gray-500 text-sm line-through">{course.originalPrice} INDI</p>}
                </div>
                <button
                  onClick={async () => {
                    setEnrollError(null);
                    setEnrollPending(true);
                    try {
                      const result = await onEnroll(course.id);
                      setReceiptId(String(result?.receiptId || ''));
                      setEnrolled(true);
                      setTimeout(onClose, 2000);
                    } catch (error) {
                      const message = error instanceof Error ? error.message : 'Enrollment failed';
                      setEnrollError(message);
                    } finally {
                      setEnrollPending(false);
                    }
                  }}
                  disabled={enrollPending}
                  className="px-6 py-3 bg-gradient-to-r from-[#d4af37] to-[#b8941f] text-black font-bold rounded-xl hover:shadow-lg hover:shadow-[#d4af37]/30 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <Play size={16} /> {enrollPending ? 'Enrolling...' : merch.ctaLabel}
                </button>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <button
                  onClick={async () => {
                    if (reportPending) return;
                    setReportPending(true);
                    setReportState('idle');
                    try {
                      await onReport(course.id, 'listing_quality', 'Reported from course detail modal');
                      setReportState('success');
                    } catch {
                      setReportState('error');
                    } finally {
                      setReportPending(false);
                    }
                  }}
                  className="text-xs text-gray-400 hover:text-[#DC143C] transition-colors flex items-center gap-1"
                >
                  <Flag size={12} />
                  {reportPending ? 'Reporting...' : 'Report listing'}
                </button>
                {reportState === 'success' && <span className="text-[11px] text-green-400">Reported</span>}
                {reportState === 'error' && <span className="text-[11px] text-red-400">Report failed</span>}
              </div>
              {enrollError && <p className="text-red-400 text-xs mt-3">{enrollError}</p>}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// â”€â”€ Learning Path Modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function LearningPathModal({ path, onClose }: { path: typeof learningPaths[0]; onClose: () => void }) {
  const [enrolled, setEnrolled] = useState(false);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-md bg-[#141414] border border-[#d4af37]/20 rounded-2xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="relative h-40 overflow-hidden">
          <img src={path.image} alt={path.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141414] to-transparent" />
          <button onClick={onClose} className="absolute top-3 right-3 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-black/80">
            <X size={16} />
          </button>
          <div className="absolute bottom-3 left-4">
            <p className="text-white font-bold text-xl">{path.title}</p>
            <p className="text-gray-400 text-sm">{path.level}</p>
          </div>
        </div>
        {enrolled ? (
          <div className="p-8 flex flex-col items-center gap-3">
            <CheckCircle size={40} className="text-[#d4af37]" />
            <p className="text-white font-bold text-xl">Path Started!</p>
            <p className="text-gray-400 text-sm text-center">Your learning journey for <span className="text-[#d4af37]">{path.title}</span> has begun.</p>
          </div>
        ) : (
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-[#0a0a0a] rounded-lg text-center">
                <BookOpen size={16} className="text-[#d4af37] mx-auto mb-1" />
                <p className="text-white font-bold">{path.courses}</p>
                <p className="text-gray-500 text-xs">Courses</p>
              </div>
              <div className="p-3 bg-[#0a0a0a] rounded-lg text-center">
                <Clock size={16} className="text-[#d4af37] mx-auto mb-1" />
                <p className="text-white font-bold">{path.duration}</p>
                <p className="text-gray-500 text-xs">Est. Duration</p>
              </div>
            </div>
            <button
              onClick={() => { setEnrolled(true); setTimeout(onClose, 2000); }}
              className="w-full py-3 bg-gradient-to-r from-[#d4af37] to-[#b8941f] text-black font-bold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <GraduationCap size={16} /> Start This Path
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CoursesMarketplace() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('popular');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [displayedCourses, setDisplayedCourses] = useState<typeof courses>([]);
  const [hasMore, setHasMore] = useState(false);
  const [isFetchingCatalog, setIsFetchingCatalog] = useState(false);
  const [catalogError, setCatalogError] = useState<string | null>(null);
  const [usingMockFallback, setUsingMockFallback] = useState(false);
  const [catalogPage, setCatalogPage] = useState(1);
  const fetchSeq = useRef(0);
  const [selectedCourse, setSelectedCourse] = useState<typeof courses[0] | null>(null);
  const [selectedPath, setSelectedPath] = useState<typeof learningPaths[0] | null>(null);
  const [likedCourses, setLikedCourses] = useState<Set<string>>(new Set());
  const [sharedCourses, setSharedCourses] = useState<Set<string>>(new Set());
  const [reportedCourses, setReportedCourses] = useState<Set<string>>(new Set());

  const getActiveWallet = () => {
    if (typeof window === 'undefined') return '';
    return (window.localStorage.getItem('indigena_wallet_address') || '').trim().toLowerCase();
  };

  const toggleLike = async (id: string) => {
    try {
      const wallet = getActiveWallet() || (await requireWalletAction('save courses to your watchlist')).wallet;
      const response = await toggleCourseWatchlist(id, wallet);
      const active = Boolean((response as { data?: { active?: boolean } })?.data?.active);
      setLikedCourses(prev => {
        const s = new Set(prev);
        if (active) s.add(id); else s.delete(id);
        return s;
      });
      setCatalogError(null);
    } catch (error) {
      setCatalogError(error instanceof Error ? error.message : 'Unable to update your watchlist right now.');
    }
  };

  const toggleShare = async (id: string) => {
    try {
      const wallet = getActiveWallet() || (await requireWalletAction('share this course')).wallet;
      setSharedCourses(prev => { const s = new Set(prev); s.add(id); return s; });
      if (typeof window === 'undefined') return;
      const shareUrl = `${window.location.origin}/courses/${id}`;
      await shareCourse(id, wallet, 'native', shareUrl);
      try {
        await navigator.clipboard.writeText(shareUrl);
      } catch {
        // Clipboard access is not available in every browser context.
      }
      setCatalogError(null);
    } catch (error) {
      setCatalogError(error instanceof Error ? error.message : 'Unable to share this course right now.');
    }
  };

  // Filter state
  const [filterLevel, setFilterLevel] = useState('');
  const [filterDuration, setFilterDuration] = useState('');
  const [filterVerification, setFilterVerification] = useState('');
  const [filterMinPrice, setFilterMinPrice] = useState('');
  const [filterMaxPrice, setFilterMaxPrice] = useState('');
  const [ownershipFilter, setOwnershipFilter] = useState<'all' | 'creator' | 'community'>('all');
  const [communityCourseOffers, setCommunityCourseOffers] = useState<CommunityMarketplaceOffer[]>([]);

  const filteredCourses = useMemo(() => {
    let list = [...displayedCourses];

    // Category
    if (activeCategory !== 'all') list = list.filter(c => c.category === activeCategory);

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(c =>
        c.title.toLowerCase().includes(q) ||
        c.instructor.toLowerCase().includes(q) ||
        c.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    // Level
    if (filterLevel) list = list.filter(c => c.level === filterLevel);

    // Duration
    if (filterDuration === 'under4') list = list.filter(c => parseInt(c.duration) < 4);
    if (filterDuration === '4to8')   list = list.filter(c => { const w = parseInt(c.duration); return w >= 4 && w <= 8; });
    if (filterDuration === 'over8')  list = list.filter(c => parseInt(c.duration) > 8);

    // Verification
    if (filterVerification === 'platinum') list = list.filter(c => c.verification === 'Platinum');
    if (filterVerification === 'gold')     list = list.filter(c => ['Platinum', 'Gold'].includes(c.verification));
    if (filterVerification === 'silver')   list = list.filter(c => ['Platinum', 'Gold', 'Silver'].includes(c.verification));

    // Price range
    const minRaw = filterMinPrice ? Number(filterMinPrice) : null;
    const maxRaw = filterMaxPrice ? Number(filterMaxPrice) : null;
    const hasMin = minRaw !== null && Number.isFinite(minRaw);
    const hasMax = maxRaw !== null && Number.isFinite(maxRaw);
    const normalizedMin = hasMin ? (minRaw as number) : null;
    const normalizedMax = hasMax ? (maxRaw as number) : null;
    const minP = normalizedMin !== null && normalizedMax !== null ? Math.min(normalizedMin, normalizedMax) : normalizedMin;
    const maxP = normalizedMin !== null && normalizedMax !== null ? Math.max(normalizedMin, normalizedMax) : normalizedMax;
    if (minP !== null) list = list.filter(c => c.price >= minP);
    if (maxP !== null) list = list.filter(c => c.price <= maxP);
    // Local sort fallback (main sorting is server-driven for live catalog).
    if (sortBy === 'newest') list = [...list].reverse();
    if (sortBy === 'price-low') list = [...list].sort((a, b) => a.price - b.price);
    if (sortBy === 'price-high') list = [...list].sort((a, b) => b.price - a.price);
    if (sortBy === 'rating') list = [...list].sort((a, b) => b.rating - a.rating);
    if (sortBy === 'popular') list = [...list].sort((a, b) => b.students - a.students);

    return list;
  }, [displayedCourses, activeCategory, searchQuery, filterLevel, filterDuration, filterVerification, filterMinPrice, filterMaxPrice, sortBy]);

  useEffect(() => {
    let cancelled = false;
    fetchCommunityMarketplaceOffers({ pillar: 'courses', search: searchQuery || undefined })
      .then((offers) => {
        if (!cancelled) {
          setCommunityCourseOffers(offers);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setCommunityCourseOffers([]);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [searchQuery]);

  const filteredCommunityCourseOffers = useMemo(
    () =>
      communityCourseOffers.filter((offer) => {
        if (activeCategory === 'all') return true;
        const categoryNeedle = activeCategory.replace(/_/g, ' ');
        return [offer.title, offer.description, offer.pillarLabel, offer.splitLabel]
          .join(' ')
          .toLowerCase()
          .includes(categoryNeedle);
      }),
    [activeCategory, communityCourseOffers]
  );

  const mixedCourseFeed = useMemo(() => {
    const feed: Array<
      | { type: 'course'; course: (typeof courses)[number] }
      | { type: 'community'; offer: CommunityMarketplaceOffer }
    > = [];

    if (ownershipFilter !== 'community') {
      filteredCourses.forEach((course, idx) => {
        feed.push({ type: 'course', course });
        if (ownershipFilter === 'all') {
          const communityOffer = filteredCommunityCourseOffers[idx];
          if (communityOffer) {
            feed.push({ type: 'community', offer: communityOffer });
          }
        }
      });
    }

    if (ownershipFilter !== 'creator') {
      const insertedIds = new Set(
        feed.filter((entry): entry is { type: 'community'; offer: CommunityMarketplaceOffer } => entry.type === 'community').map((entry) => entry.offer.id)
      );
      filteredCommunityCourseOffers.forEach((offer) => {
        if (!insertedIds.has(offer.id)) {
          feed.push({ type: 'community', offer });
        }
      });
    }

    return feed;
  }, [filteredCourses, filteredCommunityCourseOffers, ownershipFilter]);

  const loadMoreCourses = () => {
    if (usingMockFallback || isFetchingCatalog || !hasMore) return;
    setCatalogPage((prev) => prev + 1);
  };

  const handleEnrollCourse = async (courseId: string) => {
    const { wallet } = await requireWalletAction('enroll in this course');
    const selected = displayedCourses.find((course) => course.id === courseId);
    const numericPrice = Number(selected?.price || 0);
    if (numericPrice > 0) {
      const paymentIntent = await createCoursePaymentIntent(courseId, wallet);
      if (!paymentIntent?.intentId || !paymentIntent?.clientSecret) {
        throw new Error('Unable to create payment intent for this enrollment.');
      }
      const confirmResponse = await confirmCoursePayment(
        courseId,
        paymentIntent.intentId,
        paymentIntent.clientSecret,
        wallet
      );
      const receipt = (confirmResponse as { receipt?: { receiptId?: string; amount?: number; currency?: string } })?.receipt;
      return receipt || null;
    }

    const response = await enrollInCourse(courseId, wallet);
    const receipt = (response as { receipt?: { receiptId?: string; amount?: number; currency?: string } })?.receipt;
    return receipt || null;
  };

  const handleReportCourse = async (courseId: string, reason: string, details = '') => {
    const { wallet } = await requireWalletAction('report this course listing');
    await reportCourse(courseId, wallet, reason, details);
    setReportedCourses(prev => {
      const s = new Set(prev);
      s.add(courseId);
      return s;
    });
  };

  useEffect(() => {
    const controller = new AbortController();
    const seq = ++fetchSeq.current;
    const delay = setTimeout(async () => {
      try {
        setIsFetchingCatalog(true);
        setCatalogError(null);
        const levelMap: Record<string, string> = { Beginner: 'beginner', Intermediate: 'intermediate', Advanced: 'advanced' };
        const page = await fetchCoursesCatalog({
          q: searchQuery || undefined,
          categoryId: activeCategory !== 'all' ? activeCategory : undefined,
          level: filterLevel ? (levelMap[filterLevel] || undefined) : undefined,
          sort: sortBy as 'popular' | 'newest' | 'price-low' | 'price-high' | 'rating',
          minPrice: filterMinPrice ? Number(filterMinPrice) : undefined,
          maxPrice: filterMaxPrice ? Number(filterMaxPrice) : undefined,
          durationMinWeeks: filterDuration === '4to8' ? 4 : filterDuration === 'over8' ? 8 : undefined,
          durationMaxWeeks: filterDuration === 'under4' ? 4 : filterDuration === '4to8' ? 8 : undefined,
          page: catalogPage,
          limit: 24
        }, controller.signal);

        if (seq !== fetchSeq.current) return;

        const mapped = Array.isArray(page.courses) ? page.courses.map(mapApiCourseToMarketplace) : [];
        if (catalogPage === 1 && mapped.length === 0) {
          setUsingMockFallback(true);
          setDisplayedCourses(MOCK_COURSE_CATALOG);
          setHasMore(false);
          return;
        }

        setUsingMockFallback(false);
        setHasMore((page.page || 1) < (page.pages || 1));

        if (catalogPage === 1) {
          setDisplayedCourses(mapped);
        } else {
          setDisplayedCourses((prev) => {
            const existing = new Set(prev.map((course) => course.id));
            const next = mapped.filter((course) => !existing.has(course.id));
            return [...prev, ...next];
          });
        }
      } catch (error) {
        if ((error as Error).name === 'AbortError') return;
        if (seq !== fetchSeq.current) return;
        setCatalogError('Unable to load courses from API.');
        if (catalogPage === 1) {
          setUsingMockFallback(false);
          setDisplayedCourses([]);
        }
        setHasMore(false);
      } finally {
        if (seq === fetchSeq.current) setIsFetchingCatalog(false);
      }
    }, 250);

    return () => {
      clearTimeout(delay);
      controller.abort();
    };
  }, [activeCategory, searchQuery, filterLevel, filterDuration, filterMinPrice, filterMaxPrice, sortBy, catalogPage]);

  useEffect(() => {
    setCatalogPage(1);
  }, [activeCategory, searchQuery, filterLevel, filterDuration, filterMinPrice, filterMaxPrice, sortBy]);

  return (
    <div className="p-6">
      <section className="relative overflow-hidden rounded-[32px] border border-[#d4af37]/20 bg-[linear-gradient(135deg,rgba(18,14,9,0.98),rgba(11,11,11,0.98))] p-7 md:p-9">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(212,175,55,0.14),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(220,20,60,0.12),transparent_34%)]" />
        <div className="relative grid gap-8 xl:grid-cols-[1.1fr,0.9fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#d4af37]">Guided learning ecosystem</p>
            <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight text-white md:text-5xl">
              Learn through story, language, and lived knowledge.
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-[#e9dfcf]">
              Begin your journey with Indigenous teachers across language, art, culture, land-based practice, and business building. Start with a guided path or browse the full course marketplace when you already know what you need.
            </p>
            <p className="mt-4 max-w-3xl text-base font-medium leading-8 text-[#f2ddb0]">
              This is not just a catalog. It is a place to begin transformation through teaching that carries context, relationship, and real practice.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="#learning-paths" className="rounded-full bg-[#d4af37] px-5 py-3 text-sm font-semibold text-black transition hover:bg-[#f4d370]">
                Start Learning
              </Link>
              <Link href="#course-catalog" className="rounded-full border border-white/10 bg-black/20 px-5 py-3 text-sm text-white transition hover:border-[#d4af37]/35 hover:text-[#f3d780]">
                Browse Courses
              </Link>
              <Link href="/courses/create" className="rounded-full border border-[#9b6b2b]/35 px-5 py-3 text-sm text-[#e3be83] transition hover:bg-[#9b6b2b]/12">
                Become a Teacher
              </Link>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            <div className="rounded-[26px] border border-[#d4af37]/20 bg-black/25 p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-[#d4af37]">Start here</p>
              <p className="mt-3 text-2xl font-semibold text-white">Choose your path</p>
              <p className="mt-2 text-sm leading-7 text-[#d5cab8]">Guided entry points for beginners, language learners, cultural artists, land-based learners, and professional builders.</p>
            </div>
            <div className="rounded-[26px] border border-white/10 bg-black/25 p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-[#d4af37]">Live learning</p>
              <p className="mt-3 text-2xl font-semibold text-white">Workshops, circles, and sessions are active now</p>
              <p className="mt-2 text-sm leading-7 text-[#d5cab8]">Move beyond static content into live teaching, community questions, and guided practice with instructors.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { label: 'Learning journeys available', value: platformStats.totalCourses },
          { label: 'Active learners this month', value: platformStats.activeStudents.toLocaleString() },
          { label: 'Indigenous teachers', value: platformStats.indigenousInstructors },
          { label: 'Certificates and completions', value: platformStats.certificatesIssued.toLocaleString() }
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-[#d4af37]/20 bg-[#141414] p-4">
            <p className="text-2xl font-bold text-[#d4af37]">{stat.value}</p>
            <p className="text-sm text-gray-400">{stat.label}</p>
          </div>
        ))}
      </div>

      <section id="learning-paths" className="mt-10">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#d4af37]">Choose your path</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">Start your learning path</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[#d5cab8]">Different learners need different entry points. Start with the path that matches your intention, then go deeper into the full catalog.</p>
          </div>
          <Link href="/courses/paths" className="text-sm text-[#d4af37] hover:text-[#f4e4a6] transition-colors">
            View All Paths
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {learningPaths.map((path) => (
            <div
              key={path.id}
              onClick={() => setSelectedPath(path)}
              className="group cursor-pointer overflow-hidden rounded-[24px] border border-[#d4af37]/18 bg-[#141414] transition-all hover:-translate-y-1 hover:border-[#d4af37]/40"
            >
              <div className="relative h-36 overflow-hidden">
                <img src={path.image} alt={path.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.82))]" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <p className="text-lg font-semibold text-white">{path.title}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[#f3d780]">{path.level}</p>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm leading-6 text-[#d5cab8]">{path.description}</p>
                <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
                  <span className="flex items-center gap-1"><BookOpen size={12} />{path.courses} courses</span>
                  <span className="flex items-center gap-1"><Clock size={12} />{path.duration}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12 grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
        <article className="overflow-hidden rounded-[30px] border border-[#d4af37]/20 bg-[linear-gradient(180deg,rgba(212,175,55,0.08),rgba(10,10,10,0.98))]">
          <div className="p-7">
            <p className="text-xs uppercase tracking-[0.28em] text-[#d4af37]">{featuredJourney.title}</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">{featuredJourney.name}</h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-[#d5cab8]">{featuredJourney.description}</p>
          </div>
          <div className="grid gap-px bg-white/5 md:grid-cols-3">
            {featuredJourney.steps.map((step) => (
              <div key={step.id} className="bg-[#101010] p-6">
                <p className="text-xs uppercase tracking-[0.22em] text-[#d4af37]">{step.label}</p>
                <h3 className="mt-3 text-xl font-semibold text-white">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#d5cab8]">{step.detail}</p>
                <p className="mt-4 text-sm font-medium leading-6 text-[#f2ddb0]">{step.outcome}</p>
              </div>
            ))}
          </div>
        </article>
        <aside className="rounded-[30px] border border-white/10 bg-[#141414] p-7">
          <p className="text-xs uppercase tracking-[0.28em] text-[#d4af37]">What you’ll gain</p>
          <div className="mt-5 space-y-4">
            {[
              'A clearer starting point instead of a flat catalog of equal choices.',
              'A stronger sense of progression from beginner practice to deeper study.',
              'A path into live learning, materials, and teacher relationships beyond one-off enrollment.',
              featuredJourney.support
            ].map((item) => (
              <div key={item} className="rounded-[20px] border border-white/10 bg-black/20 p-4 text-sm leading-7 text-[#d5cab8]">
                {item}
              </div>
            ))}
          </div>
        </aside>
      </section>

      {/* Premium Placement #7 — Sticky Announcement Banner */}
      <div className="mt-12">
        <CoursesStickyBanner />
      </div>

      {/* Featured Banner - Premium Placement */}
      <FeaturedBanner pillar="courses" />

      {/* Promoted Courses - Revenue Spot */}
      <PromotedCourses pillar="courses" />

      {/* Featured Instructors - Revenue Spot */}
      <InstructorSpotlight pillar="courses" />

      {/* Bundle Promotions - Revenue Spot */}
      <BundlePromotions pillar="courses" />

      {/* Pillar Artist Spotlight - Shows Featured Instructors */}
      <PillarArtistSpotlight pillar="courses" />

      <section className="mt-12 rounded-[28px] border border-[#d4af37]/18 bg-[linear-gradient(135deg,rgba(12,12,12,0.98),rgba(17,11,6,0.98))] p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-[#d4af37]">Live learning now</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">Learning on Indigena is active, not static</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[#d5cab8]">Join live sessions, circles, and workshops that make the learning environment feel immediate and communal.</p>
          </div>
          <Link href="/courses/live/session-demo" className="rounded-full border border-[#d4af37]/25 bg-[#d4af37]/10 px-4 py-2 text-sm text-[#f3d780] hover:border-[#d4af37]/40 hover:bg-[#d4af37]/15">
            View live sessions
          </Link>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            { title: 'Live story circle', detail: 'An evening session with teacher Q&A and guided reflection.' },
            { title: 'Language practice hour', detail: 'Small-group speaking practice happening this week.' },
            { title: 'Workshop replay + notes', detail: 'Recent teaching sessions with downloadable materials and prompts.' }
          ].map((item) => (
            <div key={item.title} className="rounded-[22px] border border-white/10 bg-black/20 p-5">
              <p className="text-lg font-semibold text-white">{item.title}</p>
              <p className="mt-3 text-sm leading-7 text-[#d5cab8]">{item.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Search & Category Filter */}
      <div id="course-catalog" className="mb-8 mt-12">
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Browse courses, instructors, and topics once you know what you want..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#141414] border border-[#d4af37]/20 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#d4af37]"
          />
        </div>
        {isFetchingCatalog && <p className="text-xs text-gray-500 mb-3">Updating courses...</p>}
        {catalogError && <p className="text-xs text-amber-400 mb-3">{catalogError}</p>}
        {usingMockFallback && (
          <p className="text-xs text-[#d4af37] mb-3">
            Showing preview content because no live courses are currently published.
          </p>
        )}

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {courseCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                activeCategory === category.id
                  ? 'bg-[#d4af37] text-black font-medium'
                  : 'bg-[#141414] text-gray-400 hover:text-white border border-[#d4af37]/20'
              }`}
            >
              <span>{category.iconEmoji}</span>
              {category.id !== 'all' && (
                <span
                  className="inline-block w-2 h-2 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
              )}
              <span className="text-sm">{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Learning Paths */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Learning Paths</h2>
          <Link 
            href="/courses/paths"
            className="text-[#d4af37] text-sm hover:text-[#f4e4a6] transition-colors"
          >
            View All
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {learningPaths.map((path) => (
            <div
              key={path.id}
              onClick={() => setSelectedPath(path)}
              className="group bg-[#141414] rounded-xl overflow-hidden border border-[#d4af37]/20 hover:border-[#d4af37]/50 transition-all cursor-pointer"
            >
              <div className="relative h-32 overflow-hidden">
                <img src={path.image} alt={path.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141414] to-transparent" />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="px-3 py-1.5 bg-[#d4af37] text-black text-xs font-semibold rounded-lg">Start Path</span>
                </div>
                <div className="absolute bottom-3 left-3">
                  <h3 className="text-white font-semibold">{path.title}</h3>
                </div>
              </div>
              <div className="p-3">
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <BookOpen size={12} />
                    {path.courses} courses
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {path.duration}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 h-px bg-[#d4af37]/20" />
        <span className="text-gray-500 text-sm">{mixedCourseFeed.length} learning offers available</span>
        <div className="flex-1 h-px bg-[#d4af37]/20" />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-wrap items-center gap-3">
          {/* Sort */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-[#141414] border border-[#d4af37]/20 rounded-lg px-4 py-2 pr-10 text-sm text-white focus:outline-none focus:border-[#d4af37] cursor-pointer"
            >
              <option value="popular">Most Popular</option>
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
          </div>

          {/* Filter Toggle */}
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
              showFilters 
                ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#d4af37]' 
                : 'bg-[#141414] border-[#d4af37]/20 text-gray-300 hover:border-[#d4af37]'
            }`}
          >
            <Filter size={16} />
            <span className="text-sm">Filters</span>
          </button>

          <div className="flex items-center gap-2 rounded-full border border-[#d4af37]/20 bg-[#141414] p-1">
            {[
              { id: 'all', label: 'All ownership' },
              { id: 'creator', label: 'Creator-owned' },
              { id: 'community', label: 'Community-owned' }
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setOwnershipFilter(option.id as 'all' | 'creator' | 'community')}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  ownershipFilter === option.id
                    ? 'bg-[#d4af37] text-black'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center bg-[#141414] rounded-lg border border-[#d4af37]/20 p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded transition-colors ${
              viewMode === 'grid' ? 'bg-[#d4af37]/20 text-[#d4af37]' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Grid3X3 size={18} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded transition-colors ${
              viewMode === 'list' ? 'bg-[#d4af37]/20 text-[#d4af37]' : 'text-gray-400 hover:text-white'
            }`}
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="mb-6 p-4 bg-[#141414] rounded-xl border border-[#d4af37]/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold text-sm">Advanced Filters</h3>
            <button
              onClick={() => {
                setFilterLevel('');
                setFilterDuration('');
                setFilterVerification('');
                setFilterMinPrice('');
                setFilterMaxPrice('');
              }}
              className="text-xs text-[#DC143C] hover:text-red-400 transition-colors"
            >
              Reset filters
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">Price Range (INDI)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filterMinPrice}
                  onChange={e => setFilterMinPrice(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-[#d4af37]/20 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#d4af37]"
                />
                <span className="text-gray-500">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filterMaxPrice}
                  onChange={e => setFilterMaxPrice(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-[#d4af37]/20 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">Level</label>
              <select
                value={filterLevel}
                onChange={e => setFilterLevel(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-[#d4af37]/20 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#d4af37]"
              >
                <option value="">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">Duration</label>
              <select
                value={filterDuration}
                onChange={e => setFilterDuration(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-[#d4af37]/20 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#d4af37]"
              >
                <option value="">Any Duration</option>
                <option value="under4">Under 4 weeks</option>
                <option value="4to8">4-8 weeks</option>
                <option value="over8">8+ weeks</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">Verification</label>
              <select
                value={filterVerification}
                onChange={e => setFilterVerification(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-[#d4af37]/20 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#d4af37]"
              >
                <option value="">All</option>
                <option value="platinum">Platinum Only</option>
                <option value="gold">Gold+</option>
                <option value="silver">Silver+</option>
              </select>
            </div>
          </div>
          {/* Active filter chips */}
          {(filterLevel || filterDuration || filterVerification || filterMinPrice || filterMaxPrice) && (
            <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-white/5">
              <span className="text-gray-500 text-xs">Active:</span>
              {filterLevel && <span className="flex items-center gap-1 px-2 py-0.5 bg-[#d4af37]/10 text-[#d4af37] text-xs rounded-full border border-[#d4af37]/20">{filterLevel} <button onClick={() => setFilterLevel('')}><X size={10}/></button></span>}
              {filterDuration && <span className="flex items-center gap-1 px-2 py-0.5 bg-[#d4af37]/10 text-[#d4af37] text-xs rounded-full border border-[#d4af37]/20">{filterDuration === 'under4' ? 'Under 4 weeks' : filterDuration === '4to8' ? '4-8 weeks' : filterDuration === 'over8' ? '8+ weeks' : filterDuration} <button onClick={() => setFilterDuration('')}><X size={10}/></button></span>}
              {filterVerification && <span className="flex items-center gap-1 px-2 py-0.5 bg-[#d4af37]/10 text-[#d4af37] text-xs rounded-full border border-[#d4af37]/20">{filterVerification === 'platinum' ? 'Platinum+' : filterVerification === 'gold' ? 'Gold+' : filterVerification === 'silver' ? 'Silver+' : `${filterVerification}+`} <button onClick={() => setFilterVerification('')}><X size={10}/></button></span>}
              {(filterMinPrice || filterMaxPrice) && <span className="flex items-center gap-1 px-2 py-0.5 bg-[#d4af37]/10 text-[#d4af37] text-xs rounded-full border border-[#d4af37]/20">{filterMinPrice||'0'}-{filterMaxPrice||'INF'} INDI <button onClick={() => { setFilterMinPrice(''); setFilterMaxPrice(''); }}><X size={10}/></button></span>}
              {ownershipFilter !== 'all' && <span className="flex items-center gap-1 px-2 py-0.5 bg-[#d4af37]/10 text-[#d4af37] text-xs rounded-full border border-[#d4af37]/20">{ownershipFilter === 'community' ? 'Community-owned' : 'Creator-owned'} <button onClick={() => setOwnershipFilter('all')}><X size={10}/></button></span>}
            </div>
          )}
        </div>
      )}

      {/* Course Grid */}
      <div className={`grid gap-6 ${
        viewMode === 'grid' 
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
          : 'grid-cols-1'
      }`}>
        {mixedCourseFeed.map((entry) => {
          if (entry.type === 'community') {
            return <CommunityMarketplaceCard key={`community-course-${entry.offer.id}`} offer={entry.offer} mode="mixed" className="h-full" />;
          }

          const course = entry.course;
          const merch = getMarketplaceCardMerchandising({
            title: course.title || 'Untitled course',
            pillarLabel: 'Courses',
            image: course.thumbnail || '',
            coverImage: course.thumbnail || '',
            galleryOrder: course.thumbnail ? [course.thumbnail] : [],
            ctaMode: 'enroll',
            ctaPreset: 'enroll-now',
            availabilityLabel: 'Open enrollment',
            availabilityTone: 'success',
            featured: Boolean(course.isFeatured),
            merchandisingRank: course.isFeatured ? 2 : 12,
            status: 'Active',
            priceLabel: `${course.price ?? 0} ${course.currency || 'INDI'}`,
            blurb: course.description || '',
          });

          return <div
            key={course.id}
            className={`group bg-[#141414] rounded-xl overflow-hidden border border-[#d4af37]/20 hover:border-[#d4af37]/50 transition-all hover:shadow-lg hover:shadow-[#d4af37]/10 cursor-pointer ${
              viewMode === 'list' ? 'flex' : ''
            }`}
            onClick={() => setSelectedCourse(course)}
          >
            {/* Thumbnail */}
            <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-64 flex-shrink-0' : ''}`}>
              <img 
                src={merch.image}
                alt={course.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#141414] to-transparent opacity-60" />
              
              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-16 h-16 rounded-full bg-[#d4af37]/90 flex items-center justify-center">
                  <Play size={24} className="text-black ml-1" />
                </div>
              </div>

              {/* Badges */}
              <div className="absolute top-3 left-3 flex items-center gap-2">
                {course.isFeatured && (
                  <span className="px-2 py-1 bg-[#d4af37] text-black text-xs font-medium rounded">
                    Featured
                  </span>
                )}
                <span className="px-2 py-1 bg-black/70 text-[#f4d370] text-xs font-medium rounded border border-[#d4af37]/25">
                  Verified
                </span>
                {merch.launchBadge && (
                  <span className="px-2 py-1 bg-emerald-500 text-white text-xs font-medium rounded">
                    {merch.launchBadge}
                  </span>
                )}
                {course.originalPrice && (
                  <span className="px-2 py-1 bg-[#DC143C] text-white text-xs font-medium rounded">
                    Sale
                  </span>
                )}
              </div>

              {/* Verification Badge */}
              <div 
                className="absolute top-3 right-3 px-2 py-1 rounded text-xs font-medium"
                style={{ 
                  backgroundColor: verificationBadges[course.verification as keyof typeof verificationBadges].color + '30',
                  color: verificationBadges[course.verification as keyof typeof verificationBadges].color
                }}
              >
                {course.verification}
              </div>

              {/* Level Badge */}
              <div className="absolute bottom-3 left-3 flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-[#0a0a0a]/80 rounded text-xs text-white">
                  {course.level}
                </span>
                <span className="px-2 py-1 bg-[#d4af37]/15 rounded text-xs text-[#f3d780] border border-[#d4af37]/20">
                  {getCourseFormatLabel(course)}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 flex-1">
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-2">
                {course.tags.map((tag) => (
                  <span key={tag} className="text-xs text-[#d4af37]/80">#{tag}</span>
                ))}
              </div>

              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-[#d4af37] transition-colors">
                {course.title}
              </h3>
              
              <p className="text-gray-400 text-sm mb-3 line-clamp-2">{course.description}</p>

              <div className="mb-3 rounded-xl border border-[#d4af37]/15 bg-[#d4af37]/8 p-3">
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#d4af37]">What you’ll gain</p>
                <p className="mt-2 text-sm leading-6 text-[#f1e4cf]">{getCourseOutcome(course)}</p>
              </div>

              {/* Instructor */}
              <div className="flex items-center gap-2 mb-3">
                <img 
                  src={course.instructorAvatar} 
                  alt={course.instructor}
                  className="w-6 h-6 rounded-full object-cover"
                />
                <span className="text-sm text-gray-300">{course.instructor}</span>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  {course.duration}
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen size={14} />
                  {course.lessons} lessons
                </span>
                <span className="flex items-center gap-1">
                  <Users size={14} />
                  {course.students.toLocaleString()}
                </span>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-1">
                  <Star size={14} className="text-[#d4af37] fill-[#d4af37]" />
                  <span className="text-white font-medium">{course.rating}</span>
                </div>
                <span className="text-gray-500 text-sm">({course.reviews} reviews)</span>
              </div>

              <div className="mb-3 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full border border-[#d4af37]/20 bg-[#d4af37]/10 px-2.5 py-1 text-[#f3ddb1]">
                  {getCourseFormatLabel(course)}
                </span>
                <span className="rounded-full border border-white/10 bg-black/20 px-2.5 py-1 text-gray-300">
                  {course.level === 'Beginner' ? 'Strong first step' : course.level === 'Advanced' ? 'For deeper study' : 'Guided progression'}
                </span>
              </div>

              {/* Price & Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-[#d4af37]/10">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-[#d4af37]">{course.price} INDI</span>
                  {course.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">{course.originalPrice} INDI</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); void toggleLike(course.id); }}
                    className={`p-2 transition-colors ${likedCourses.has(course.id) ? 'text-[#DC143C]' : 'text-gray-400 hover:text-[#DC143C]'}`}
                  >
                    <Heart size={18} fill={likedCourses.has(course.id) ? '#DC143C' : 'none'} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); void toggleShare(course.id); }}
                    className={`p-2 transition-colors ${sharedCourses.has(course.id) ? 'text-[#d4af37]' : 'text-gray-400 hover:text-[#d4af37]'}`}
                  >
                    <Share2 size={18} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); void handleReportCourse(course.id, 'listing_quality', 'Reported from course card'); }}
                    className={`p-2 transition-colors ${reportedCourses.has(course.id) ? 'text-[#DC143C]' : 'text-gray-400 hover:text-[#DC143C]'}`}
                  >
                    <Flag size={16} />
                  </button>
                  <button
                    onClick={() => setSelectedCourse(course)}
                    className="px-4 py-2 bg-gradient-to-r from-[#d4af37] to-[#b8941f] text-black font-medium rounded-lg hover:shadow-lg hover:shadow-[#d4af37]/30 transition-all"
                  >
                    {merch.ctaLabel}
                  </button>
                </div>
              </div>
            </div>
          </div>;
        })}
      </div>

      {/* Empty state */}
      {mixedCourseFeed.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <GraduationCap size={48} className="text-gray-600 mb-4" />
          <p className="text-white font-semibold text-lg">No courses found</p>
          <p className="text-gray-500 text-sm mt-1 mb-4">Try adjusting your filters or search query</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setActiveCategory('all');
              setFilterLevel('');
              setFilterDuration('');
              setFilterVerification('');
              setFilterMinPrice('');
              setFilterMaxPrice('');
              setOwnershipFilter('all');
            }}
            className="px-4 py-2 bg-[#d4af37] text-black text-sm font-semibold rounded-lg hover:bg-[#f4e4a6] transition-colors"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Load More */}
      {hasMore && !usingMockFallback && (
        <div className="mt-8 text-center">
          <button
            onClick={loadMoreCourses}
            disabled={isFetchingCatalog}
            className="px-8 py-3 bg-[#141414] border border-[#d4af37]/30 rounded-full text-[#d4af37] font-medium hover:bg-[#d4af37]/10 hover:border-[#d4af37] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
          >
            {isFetchingCatalog ? (
              <>
                <div className="w-4 h-4 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin" />
                Loading...
              </>
            ) : (
              'Load More Courses'
            )}
          </button>
        </div>
      )}

      {/* Become an Instructor CTA */}
      <section className="mt-12 bg-gradient-to-r from-[#d4af37]/20 via-[#0a0a0a] to-[#DC143C]/20 rounded-2xl p-8 text-center">
        <Award size={48} className="text-[#d4af37] mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Start your learning journey with Indigenous knowledge keepers.</h2>
        <p className="text-gray-400 mb-6 max-w-xl mx-auto">
          Begin with a path, explore the full course library, or step in as a teacher to share knowledge through grounded, culturally aligned learning experiences.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href="#learning-paths"
            className="inline-block px-6 py-3 bg-gradient-to-r from-[#d4af37] to-[#b8941f] text-black font-semibold rounded-xl hover:shadow-lg hover:shadow-[#d4af37]/30 transition-all"
          >
            Start a Path
          </a>
          <a
            href="#course-catalog"
            className="inline-block rounded-xl border border-white/10 px-6 py-3 text-sm font-medium text-white transition hover:border-[#d4af37]/35 hover:text-[#f3d780]"
          >
            Explore Courses
          </a>
          <a
            href="/creator-hub"
            className="inline-block rounded-xl border border-[#d4af37]/20 bg-[#d4af37]/10 px-6 py-3 text-sm font-medium text-[#f3d780] transition hover:border-[#d4af37]/35 hover:bg-[#d4af37]/15"
          >
            Become a Teacher
          </a>
        </div>
      </section>

      {/* Modals */}
      {selectedCourse && (
        <CourseDetailModal
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
          onEnroll={handleEnrollCourse}
          onReport={handleReportCourse}
        />
      )}
      {selectedPath && <LearningPathModal path={selectedPath} onClose={() => setSelectedPath(null)} />}
    </div>
  );
}













