'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Grid3X3, List, ChevronDown, Search, X, SlidersHorizontal,
  Star, Clock, CheckCircle, Heart, Eye, MapPin, BadgeCheck,
  Briefcase, ChevronLeft, ChevronRight, Zap, ArrowUpDown, Globe, Landmark, Palette, Languages, Clapperboard, Hammer, Music4, Mountain, Leaf, Scale, Laptop, Sprout, GraduationCap, Trees, Flame, BookOpen
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import ServiceDetailModal from '../components/marketplace/freelancing/ServiceDetailModal';
import SponsoredServiceCard from '../components/marketplace/freelancing/SponsoredServiceCard';
import CommunityMarketplaceCard from '@/app/components/community/CommunityMarketplaceCard';
import { fetchCommunityMarketplaceOffers, type CommunityMarketplaceOffer } from '@/app/lib/communityMarketplaceApi';

// Category definitions - 16 Indigenous Service Categories
const categories = [
  { id: 'all', name: 'All Services', icon: Globe, count: 108 },
  { id: 'cultural-consulting', name: 'Cultural Consulting', icon: Landmark, count: 12 },
  { id: 'art-creative', name: 'Art & Creative', icon: Palette, count: 15 },
  { id: 'language', name: 'Language Services', icon: Languages, count: 8 },
  { id: 'storytelling-media', name: 'Storytelling & Media', icon: Clapperboard, count: 10 },
  { id: 'traditional-crafts', name: 'Traditional Crafts', icon: Hammer, count: 11 },
  { id: 'performing-arts', name: 'Performing Arts', icon: Music4, count: 6 },
  { id: 'guiding-tourism', name: 'Guiding & Tourism', icon: Mountain, count: 7 },
  { id: 'health-wellness', name: 'Health & Wellness', icon: Leaf, count: 5 },
  { id: 'business-services', name: 'Business Services', icon: Briefcase, count: 6 },
  { id: 'legal-advocacy', name: 'Legal & Advocacy', icon: Scale, count: 4 },
  { id: 'technology', name: 'Technology', icon: Laptop, count: 7 },
  { id: 'food-agriculture', name: 'Food & Agriculture', icon: Sprout, count: 5 },
  { id: 'youth-education', name: 'Youth & Education', icon: GraduationCap, count: 6 },
  { id: 'cultural-guidance', name: 'Cultural Guidance', icon: Landmark, count: 4 },
  { id: 'environmental', name: 'Environmental', icon: Trees, count: 4 },
  { id: 'ceremonial-spiritual', name: 'Ceremonial & Spiritual', icon: Flame, count: 5 },
  { id: 'research-academic', name: 'Research & Academic', icon: BookOpen, count: 4 },
];

// Verification badge colors
const verificationColors: Record<string, string> = {
  Bronze: '#CD7F32',
  Silver: '#C0C0C0',
  Gold: '#FFD700',
  Platinum: '#E5E4E2'
};

// Mock services data - extended for View All page
const allServices = [
  // === CULTURAL CONSULTING ===
  {
    id: '1',
    title: 'Cultural Protocol Consulting',
    description: 'Advise on proper engagement with Indigenous communities, ceremonies, and sacred sites for film, museum, and corporate clients.',
    freelancerId: 'f1',
    freelancerName: 'Dr. Sarah Whitehorse',
    freelancerAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    freelancerNation: 'Lakota',
    category: 'consulting',
    skills: ['Cultural Advisory', 'Protocol Guidance', 'Sacred Sites'],
    pricingTiers: [{ name: 'Hourly', price: 200, deliveryDays: 1, features: [] }],
    portfolio: [{ title: 'Film Consulting', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop', description: 'Documentary consulting' }],
    rating: 4.9,
    reviewCount: 47,
    completedProjects: 32,
    responseTime: '< 2 hours',
    verification: 'Platinum' as const,
    isVerified: true,
    languages: ['English', 'Lakota'],
    location: 'Rapid City, SD',
    available: true,
    featured: true
  },
  {
    id: '2',
    title: 'Land Acknowledgment Development',
    description: 'Craft meaningful, community-specific land acknowledgments for schools, governments, and events.',
    freelancerId: 'f2',
    freelancerName: 'Michael Standing Bear',
    freelancerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    freelancerNation: 'Lakota',
    category: 'consulting',
    skills: ['Land Acknowledgments', 'Cultural Writing', 'Community Relations'],
    pricingTiers: [{ name: 'Standard', price: 150, deliveryDays: 3, features: [] }],
    portfolio: [{ title: 'University Acknowledgment', image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=300&h=200&fit=crop', description: 'Academic institution' }],
    rating: 4.8,
    reviewCount: 89,
    completedProjects: 67,
    responseTime: '< 4 hours',
    verification: 'Gold' as const,
    isVerified: true,
    languages: ['English', 'Lakota'],
    location: 'Denver, CO',
    available: true,
    featured: false
  },
  {
    id: '3',
    title: 'Traditional Ecological Knowledge (TEK) Consulting',
    description: 'Consult on land management, traditional fire practices, and sustainable harvesting using Indigenous knowledge.',
    freelancerId: 'f3',
    freelancerName: 'Eleanor Black Elk',
    freelancerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
    freelancerNation: 'Lakota',
    category: 'consulting',
    skills: ['TEK', 'Land Management', 'Fire Practices'],
    pricingTiers: [{ name: 'Consultation', price: 250, deliveryDays: 1, features: [] }],
    portfolio: [{ title: 'Conservation Project', image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&h=200&fit=crop', description: 'Land management' }],
    rating: 5.0,
    reviewCount: 34,
    completedProjects: 89,
    responseTime: '< 1 hour',
    verification: 'Platinum' as const,
    isVerified: true,
    languages: ['English', 'Lakota', 'Dakota'],
    location: 'Pine Ridge, SD',
    available: true,
    featured: true
  },

  // === ART & CREATIVE ===
  {
    id: '4',
    title: 'Commissioned Traditional Artwork',
    description: 'Create custom paintings, sculptures, and textiles with traditional Indigenous techniques and motifs.',
    freelancerId: 'f4',
    freelancerName: 'Rose Many Feathers',
    freelancerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    freelancerNation: 'Haudenosaunee',
    category: 'art-creative',
    skills: ['Painting', 'Sculpture', 'Textiles'],
    pricingTiers: [{ name: 'Small Piece', price: 500, deliveryDays: 14, features: [] }],
    portfolio: [{ title: 'Sacred Waters', image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=300&h=200&fit=crop', description: 'Original artwork' }],
    rating: 4.9,
    reviewCount: 67,
    completedProjects: 45,
    responseTime: '< 12 hours',
    verification: 'Gold' as const,
    isVerified: true,
    languages: ['English', 'Mohawk'],
    location: 'Toronto, ON',
    available: true,
    featured: false
  },
  {
    id: '5',
    title: 'Traditional Design Consultation',
    description: 'Advise on authentic patterns, symbols, and motifs for fashion brands and product designers.',
    freelancerId: 'f5',
    freelancerName: 'Marcus Thunderbird',
    freelancerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    freelancerNation: 'Navajo',
    category: 'art-creative',
    skills: ['Pattern Design', 'Cultural Motifs', 'Brand Consulting'],
    pricingTiers: [{ name: 'Consultation', price: 150, deliveryDays: 3, features: [] }],
    portfolio: [{ title: 'Fashion Collaboration', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop', description: 'Brand design' }],
    rating: 4.8,
    reviewCount: 42,
    completedProjects: 28,
    responseTime: '< 6 hours',
    verification: 'Gold' as const,
    isVerified: true,
    languages: ['English', 'Navajo'],
    location: 'Phoenix, AZ',
    available: true,
    featured: false
  },
  {
    id: '6',
    title: 'Custom Regalia Making',
    description: 'Create traditional ceremonial clothing and dance regalia with authentic materials and techniques.',
    freelancerId: 'f6',
    freelancerName: 'Maria Running Wolf',
    freelancerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
    freelancerNation: 'Cheyenne',
    category: 'art-creative',
    skills: ['Regalia Making', 'Beadwork', 'Leatherwork'],
    pricingTiers: [{ name: 'Full Set', price: 2500, deliveryDays: 60, features: [] }],
    portfolio: [{ title: 'Powwow Regalia', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop', description: 'Dance regalia' }],
    rating: 5.0,
    reviewCount: 28,
    completedProjects: 34,
    responseTime: '< 24 hours',
    verification: 'Platinum' as const,
    isVerified: true,
    languages: ['English', 'Cheyenne'],
    location: 'Billings, MT',
    available: true,
    featured: true
  },

  // === LANGUAGE SERVICES ===
  {
    id: '7',
    title: 'Lakota Language Translation',
    description: 'Professional translation of documents, books, and websites from English to Lakota.',
    freelancerId: 'f7',
    freelancerName: 'Grandfather William Crow',
    freelancerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    freelancerNation: 'Crow',
    category: 'language',
    skills: ['Translation', 'Lakota', 'Document Translation'],
    pricingTiers: [{ name: 'Per Page', price: 35, deliveryDays: 2, features: [] }],
    portfolio: [{ title: 'Treaty Documents', image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=300&h=200&fit=crop', description: 'Historical translation' }],
    rating: 5.0,
    reviewCount: 28,
    completedProjects: 156,
    responseTime: '< 6 hours',
    verification: 'Platinum' as const,
    isVerified: true,
    languages: ['English', 'Crow', 'Lakota'],
    location: 'Billings, MT',
    available: true,
    featured: false
  },
  {
    id: '8',
    title: 'Ojibwe Language Teaching (1-on-1)',
    description: 'One-on-one tutoring in Ojibwe language for all skill levels.',
    freelancerId: 'f8',
    freelancerName: 'Gordon Whitefish',
    freelancerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    freelancerNation: 'Ojibwe',
    category: 'language',
    skills: ['Ojibwe', 'Teaching', 'Curriculum Development'],
    pricingTiers: [{ name: '1-Hour Lesson', price: 45, deliveryDays: 1, features: [] }],
    portfolio: [{ title: 'Language App', image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=300&h=200&fit=crop', description: 'Education' }],
    rating: 4.8,
    reviewCount: 28,
    completedProjects: 156,
    responseTime: '< 6 hours',
    verification: 'Gold' as const,
    isVerified: true,
    languages: ['English', 'Ojibwe'],
    location: 'Minneapolis, MN',
    available: true,
    featured: false
  },
  {
    id: '9',
    title: 'Indigenous Voice-over & Narration',
    description: 'Record audio narration in Indigenous languages for films, documentaries, and educational materials.',
    freelancerId: 'f9',
    freelancerName: 'Jennifer Whitecloud',
    freelancerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
    freelancerNation: 'DinÃƒÆ’Ã‚Â©',
    category: 'language',
    skills: ['Voice-over', 'Narration', 'Navajo'],
    pricingTiers: [{ name: 'Per Project', price: 200, deliveryDays: 3, features: [] }],
    portfolio: [{ title: 'Documentary Narration', image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=300&h=200&fit=crop', description: 'Voice work' }],
    rating: 4.9,
    reviewCount: 34,
    completedProjects: 45,
    responseTime: '< 4 hours',
    verification: 'Gold' as const,
    isVerified: true,
    languages: ['English', 'Navajo'],
    location: 'Albuquerque, NM',
    available: true,
    featured: false
  },

  // === STORYTELLING & MEDIA ===
  {
    id: '10',
    title: 'Documentary Filmmaking',
    description: 'Produce documentary films about Indigenous stories, issues, and cultural preservation.',
    freelancerId: 'f10',
    freelancerName: 'Joseph Firekeeper',
    freelancerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    freelancerNation: 'Cherokee',
    category: 'storytelling-media',
    skills: ['Filmmaking', 'Documentary', 'Storytelling'],
    pricingTiers: [{ name: 'Short Film', price: 5000, deliveryDays: 30, features: [] }],
    portfolio: [{ title: 'Indigenous Voices', image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=300&h=200&fit=crop', description: 'Documentary' }],
    rating: 4.9,
    reviewCount: 89,
    completedProjects: 234,
    responseTime: '< 8 hours',
    verification: 'Platinum' as const,
    isVerified: true,
    languages: ['English', 'Cherokee', 'Muskogee'],
    location: 'Tahlequah, OK',
    available: true,
    featured: true
  },
  {
    id: '11',
    title: 'Indigenous Photography',
    description: 'Cultural documentation, portraits, and landscapes with authentic Indigenous perspective.',
    freelancerId: 'f11',
    freelancerName: 'Sarah Eagle Eye',
    freelancerAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    freelancerNation: 'Hopi',
    category: 'storytelling-media',
    skills: ['Photography', 'Portraits', 'Cultural Documentation'],
    pricingTiers: [{ name: 'Hourly', price: 150, deliveryDays: 1, features: [] }],
    portfolio: [{ title: 'Sacred Landscapes', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop', description: 'Photography' }],
    rating: 4.7,
    reviewCount: 56,
    completedProjects: 89,
    responseTime: '< 4 hours',
    verification: 'Gold' as const,
    isVerified: true,
    languages: ['English', 'Hopi'],
    location: 'Flagstaff, AZ',
    available: true,
    featured: false
  },
  {
    id: '12',
    title: 'Podcast Production',
    description: 'Create and edit Indigenous-focused podcasts from concept to distribution.',
    freelancerId: 'f12',
    freelancerName: 'Tyler Redbird',
    freelancerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    freelancerNation: 'Pueblo',
    category: 'storytelling-media',
    skills: ['Podcast', 'Audio Production', 'Storytelling'],
    pricingTiers: [{ name: 'Per Episode', price: 750, deliveryDays: 5, features: [] }],
    portfolio: [{ title: 'Tribal Voices Podcast', image: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=300&h=200&fit=crop', description: 'Podcast' }],
    rating: 4.8,
    reviewCount: 34,
    completedProjects: 45,
    responseTime: '< 12 hours',
    verification: 'Silver' as const,
    isVerified: true,
    languages: ['English'],
    location: 'Santa Fe, NM',
    available: true,
    featured: false
  },

  // === TRADITIONAL CRAFTS ===
  {
    id: '13',
    title: 'Traditional Hide Tanning',
    description: 'Process hides using traditional methods for museums, artisans, and cultural centers.',
    freelancerId: 'f13',
    freelancerName: 'Thomas Black Elk',
    freelancerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    freelancerNation: 'Lakota',
    category: 'traditional-crafts',
    skills: ['Hide Tanning', 'Traditional Methods', 'Buckskin'],
    pricingTiers: [{ name: 'Per Hide', price: 800, deliveryDays: 14, features: [] }],
    portfolio: [{ title: 'Traditional Buckskin', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop', description: 'Hide work' }],
    rating: 4.9,
    reviewCount: 23,
    completedProjects: 67,
    responseTime: '< 24 hours',
    verification: 'Platinum' as const,
    isVerified: true,
    languages: ['English', 'Lakota'],
    location: 'Pine Ridge, SD',
    available: true,
    featured: false
  },
  {
    id: '14',
    title: 'Beadwork Commissions',
    description: 'Create custom beadwork pieces using traditional techniques and designs.',
    freelancerId: 'f14',
    freelancerName: 'Maria Standing Bear',
    freelancerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
    freelancerNation: 'Lakota',
    category: 'traditional-crafts',
    skills: ['Beadwork', 'Traditional Design', 'Custom Pieces'],
    pricingTiers: [{ name: 'Small Item', price: 75, deliveryDays: 7, features: [] }],
    portfolio: [{ title: 'Powwow Regalia', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop', description: 'Beadwork' }],
    rating: 4.9,
    reviewCount: 42,
    completedProjects: 67,
    responseTime: '< 24 hours',
    verification: 'Gold' as const,
    isVerified: true,
    languages: ['English', 'Lakota'],
    location: 'Standing Rock, ND',
    available: true,
    featured: false
  },
  {
    id: '15',
    title: 'Traditional Canoe Building',
    description: 'Construct traditional watercraft using ancestral techniques and materials.',
    freelancerId: 'f15',
    freelancerName: 'David Riverstone',
    freelancerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    freelancerNation: 'Ojibwe',
    category: 'traditional-crafts',
    skills: ['Canoe Building', 'Woodworking', 'Traditional Methods'],
    pricingTiers: [{ name: 'Birchbark Canoe', price: 8000, deliveryDays: 90, features: [] }],
    portfolio: [{ title: 'Traditional Canoe', image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&h=200&fit=crop', description: 'Watercraft' }],
    rating: 5.0,
    reviewCount: 12,
    completedProjects: 18,
    responseTime: '< 48 hours',
    verification: 'Gold' as const,
    isVerified: true,
    languages: ['English', 'Ojibwe'],
    location: 'Duluth, MN',
    available: true,
    featured: false
  },

  // === PERFORMING ARTS ===
  {
    id: '16',
    title: 'Traditional Dance Performance',
    description: 'Perform traditional dances at events, festivals, and cultural celebrations.',
    freelancerId: 'f16',
    freelancerName: 'Dancer Collective',
    freelancerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    freelancerNation: 'Various',
    category: 'performing-arts',
    skills: ['Traditional Dance', 'Powwow', 'Performance'],
    pricingTiers: [{ name: 'Event Performance', price: 1500, deliveryDays: 1, features: [] }],
    portfolio: [{ title: 'Powwow Performance', image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=300&h=200&fit=crop', description: 'Dance' }],
    rating: 4.8,
    reviewCount: 56,
    completedProjects: 89,
    responseTime: '< 12 hours',
    verification: 'Gold' as const,
    isVerified: true,
    languages: ['English'],
    location: 'Various Locations',
    available: true,
    featured: false
  },
  {
    id: '17',
    title: 'Traditional Drum Making',
    description: 'Handcraft traditional drums with proper ceremonies and materials.',
    freelancerId: 'f17',
    freelancerName: 'Drum Maker Pete',
    freelancerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    freelancerNation: 'Cree',
    category: 'performing-arts',
    skills: ['Drum Making', 'Traditional Crafts', 'Music'],
    pricingTiers: [{ name: 'Hand Drum', price: 350, deliveryDays: 21, features: [] }],
    portfolio: [{ title: 'Ceremonial Drum', image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=200&fit=crop', description: 'Drum making' }],
    rating: 4.9,
    reviewCount: 34,
    completedProjects: 45,
    responseTime: '< 24 hours',
    verification: 'Silver' as const,
    isVerified: true,
    languages: ['English', 'Cree'],
    location: 'Saskatoon, SK',
    available: true,
    featured: false
  },

  // === GUIDING & TOURISM ===
  {
    id: '18',
    title: 'Cultural Tour Guiding',
    description: 'Lead authentic cultural tours on ancestral lands with deep historical knowledge.',
    freelancerId: 'f18',
    freelancerName: 'Guide Services',
    freelancerAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    freelancerNation: 'Navajo',
    category: 'guiding-tourism',
    skills: ['Tour Guiding', 'Cultural Knowledge', 'History'],
    pricingTiers: [{ name: 'Half-Day Tour', price: 150, deliveryDays: 1, features: [] }],
    portfolio: [{ title: 'Canyon Tours', image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&h=200&fit=crop', description: 'Tourism' }],
    rating: 4.7,
    reviewCount: 234,
    completedProjects: 450,
    responseTime: '< 4 hours',
    verification: 'Gold' as const,
    isVerified: true,
    languages: ['English', 'Navajo'],
    location: 'Monument Valley, AZ',
    available: true,
    featured: false
  },
  {
    id: '19',
    title: 'Medicinal Plant Walks',
    description: 'Guide educational walks identifying traditional medicinal plants and their uses.',
    freelancerId: 'f19',
    freelancerName: 'Herbalist Grace',
    freelancerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
    freelancerNation: 'Ojibwe',
    category: 'guiding-tourism',
    skills: ['Medicinal Plants', 'TEK', 'Guiding'],
    pricingTiers: [{ name: 'Group Walk', price: 75, deliveryDays: 1, features: [] }],
    portfolio: [{ title: 'Plant Walk', image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=300&h=200&fit=crop', description: 'Education' }],
    rating: 4.9,
    reviewCount: 67,
    completedProjects: 120,
    responseTime: '< 6 hours',
    verification: 'Platinum' as const,
    isVerified: true,
    languages: ['English', 'Ojibwe'],
    location: 'Northern Wisconsin',
    available: true,
    featured: false
  },

  // === HEALTH & WELLNESS ===
  {
    id: '20',
    title: 'Traditional Healing Consultations',
    description: 'Provide traditional medicine guidance and holistic wellness support.',
    freelancerId: 'f20',
    freelancerName: 'Healer Thomas',
    freelancerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    freelancerNation: 'Lakota',
    category: 'health-wellness',
    skills: ['Traditional Healing', 'Herbal Medicine', 'Wellness'],
    pricingTiers: [{ name: 'Session', price: 100, deliveryDays: 1, features: [] }],
    portfolio: [{ title: 'Wellness Practice', image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=300&h=200&fit=crop', description: 'Healing' }],
    rating: 4.9,
    reviewCount: 89,
    completedProjects: 234,
    responseTime: '< 8 hours',
    verification: 'Platinum' as const,
    isVerified: true,
    languages: ['English', 'Lakota'],
    location: 'Rapid City, SD',
    available: true,
    featured: false
  },
  {
    id: '21',
    title: 'Ceremony Facilitation',
    description: 'Lead traditional ceremonies including sweat lodges and healing circles.',
    freelancerId: 'f21',
    freelancerName: 'Ceremony Leader',
    freelancerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    freelancerNation: 'Various',
    category: 'health-wellness',
    skills: ['Ceremony', 'Spiritual Guidance', 'Healing'],
    pricingTiers: [{ name: 'Sweat Lodge', price: 500, deliveryDays: 1, features: [] }],
    portfolio: [{ title: 'Ceremony', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop', description: 'Ceremony' }],
    rating: 5.0,
    reviewCount: 45,
    completedProjects: 89,
    responseTime: '< 12 hours',
    verification: 'Platinum' as const,
    isVerified: true,
    languages: ['English'],
    location: 'Various Locations',
    available: true,
    featured: false
  },

  // === BUSINESS SERVICES ===
  {
    id: '22',
    title: 'Indigenous Business Consulting',
    description: 'Advise on starting and growing Indigenous-owned businesses with cultural values.',
    freelancerId: 'f22',
    freelancerName: 'Business Advisor',
    freelancerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    freelancerNation: 'Cherokee',
    category: 'business-services',
    skills: ['Business Strategy', 'Indigenous Business', 'Consulting'],
    pricingTiers: [{ name: 'Consultation', price: 175, deliveryDays: 1, features: [] }],
    portfolio: [{ title: 'Business Development', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop', description: 'Consulting' }],
    rating: 4.6,
    reviewCount: 34,
    completedProjects: 45,
    responseTime: '< 6 hours',
    verification: 'Silver' as const,
    isVerified: true,
    languages: ['English', 'Cherokee'],
    location: 'Tulsa, OK',
    available: true,
    featured: false
  },
  {
    id: '23',
    title: 'Grant Writing for Indigenous Orgs',
    description: 'Write successful grants for Indigenous organizations and communities.',
    freelancerId: 'f23',
    freelancerName: 'Grant Writer Pro',
    freelancerAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    freelancerNation: 'Navajo',
    category: 'business-services',
    skills: ['Grant Writing', 'Fundraising', 'Nonprofit'],
    pricingTiers: [{ name: 'Full Grant', price: 2500, deliveryDays: 14, features: [] }],
    portfolio: [{ title: 'Successful Grants', image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=300&h=200&fit=crop', description: 'Grants' }],
    rating: 4.8,
    reviewCount: 56,
    completedProjects: 78,
    responseTime: '< 8 hours',
    verification: 'Gold' as const,
    isVerified: true,
    languages: ['English', 'Navajo'],
    location: 'Albuquerque, NM',
    available: true,
    featured: false
  },

  // === LEGAL & ADVOCACY ===
  {
    id: '24',
    title: 'Treaty Rights Research',
    description: 'Research historical treaties and Indigenous rights documentation.',
    freelancerId: 'f24',
    freelancerName: 'Legal Researcher',
    freelancerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    freelancerNation: 'Lakota',
    category: 'legal-advocacy',
    skills: ['Treaty Research', 'Legal Documentation', 'Indigenous Rights'],
    pricingTiers: [{ name: 'Research Project', price: 150, deliveryDays: 7, features: [] }],
    portfolio: [{ title: 'Treaty Research', image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=300&h=200&fit=crop', description: 'Legal' }],
    rating: 4.7,
    reviewCount: 23,
    completedProjects: 45,
    responseTime: '< 12 hours',
    verification: 'Gold' as const,
    isVerified: true,
    languages: ['English', 'Lakota'],
    location: 'Rapid City, SD',
    available: true,
    featured: false
  },
  {
    id: '25',
    title: 'Advocacy Campaign Support',
    description: 'Develop materials and strategies for Indigenous advocacy campaigns.',
    freelancerId: 'f25',
    freelancerName: 'Advocacy Expert',
    freelancerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    freelancerNation: 'Various',
    category: 'legal-advocacy',
    skills: ['Advocacy', 'Campaign Strategy', 'Community Organizing'],
    pricingTiers: [{ name: 'Campaign Package', price: 800, deliveryDays: 10, features: [] }],
    portfolio: [{ title: 'Advocacy Work', image: 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=300&h=200&fit=crop', description: 'Advocacy' }],
    rating: 4.6,
    reviewCount: 34,
    completedProjects: 56,
    responseTime: '< 12 hours',
    verification: 'Silver' as const,
    isVerified: true,
    languages: ['English'],
    location: 'Washington, DC',
    available: true,
    featured: false
  },

  // === TECHNOLOGY ===
  {
    id: '26',
    title: 'Indigenous App Development',
    description: 'Build apps for language preservation, cultural education, and community connection.',
    freelancerId: 'f26',
    freelancerName: 'Tech Solutions',
    freelancerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    freelancerNation: 'Ojibwe',
    category: 'technology',
    skills: ['App Development', 'iOS', 'Android'],
    pricingTiers: [{ name: 'MVP App', price: 5000, deliveryDays: 45, features: [] }],
    portfolio: [{ title: 'Language App', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&h=200&fit=crop', description: 'Mobile app' }],
    rating: 4.5,
    reviewCount: 23,
    completedProjects: 15,
    responseTime: '< 4 hours',
    verification: 'Silver' as const,
    isVerified: true,
    languages: ['English'],
    location: 'Minneapolis, MN',
    available: true,
    featured: false
  },
  {
    id: '27',
    title: 'Website Design (Indigenous-focused)',
    description: 'Create websites with Indigenous aesthetics and cultural sensitivity.',
    freelancerId: 'f27',
    freelancerName: 'Web Designer',
    freelancerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
    freelancerNation: 'Pueblo',
    category: 'technology',
    skills: ['Web Design', 'UI/UX', 'Indigenous Aesthetics'],
    pricingTiers: [{ name: 'Business Website', price: 2500, deliveryDays: 21, features: [] }],
    portfolio: [{ title: 'Indigenous Website', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop', description: 'Web design' }],
    rating: 4.8,
    reviewCount: 45,
    completedProjects: 67,
    responseTime: '< 8 hours',
    verification: 'Gold' as const,
    isVerified: true,
    languages: ['English'],
    location: 'Santa Fe, NM',
    available: true,
    featured: false
  },
  {
    id: '28',
    title: 'Digital Archive Management',
    description: 'Digitize and manage cultural archives with proper protocols and permissions.',
    freelancerId: 'f28',
    freelancerName: 'Archive Specialist',
    freelancerAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    freelancerNation: 'Haudenosaunee',
    category: 'technology',
    skills: ['Digital Archives', 'Preservation', 'Cultural Protocols'],
    pricingTiers: [{ name: 'Archive Project', price: 75, deliveryDays: 7, features: [] }],
    portfolio: [{ title: 'Digital Archive', image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=300&h=200&fit=crop', description: 'Archives' }],
    rating: 4.9,
    reviewCount: 28,
    completedProjects: 34,
    responseTime: '< 12 hours',
    verification: 'Gold' as const,
    isVerified: true,
    languages: ['English', 'Mohawk'],
    location: 'Toronto, ON',
    available: true,
    featured: false
  },

  // === FOOD & AGRICULTURE ===
  {
    id: '29',
    title: 'Traditional Farming Consultation',
    description: 'Advise on Indigenous agricultural practices and traditional farming methods.',
    freelancerId: 'f29',
    freelancerName: 'Farm Expert',
    freelancerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    freelancerNation: 'Pueblo',
    category: 'food-agriculture',
    skills: ['Traditional Farming', 'Agriculture', 'TEK'],
    pricingTiers: [{ name: 'Consultation', price: 100, deliveryDays: 1, features: [] }],
    portfolio: [{ title: 'Traditional Farm', image: 'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4e7?w=300&h=200&fit=crop', description: 'Farming' }],
    rating: 4.8,
    reviewCount: 34,
    completedProjects: 45,
    responseTime: '< 8 hours',
    verification: 'Gold' as const,
    isVerified: true,
    languages: ['English', 'Tewa'],
    location: 'Santa Fe, NM',
    available: true,
    featured: false
  },
  {
    id: '30',
    title: 'Wild Food Foraging Guides',
    description: 'Lead foraging walks identifying edible plants and traditional food sources.',
    freelancerId: 'f30',
    freelancerName: 'Forager Guide',
    freelancerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    freelancerNation: 'Ojibwe',
    category: 'food-agriculture',
    skills: ['Foraging', 'Wild Foods', 'Traditional Foods'],
    pricingTiers: [{ name: 'Group Walk', price: 60, deliveryDays: 1, features: [] }],
    portfolio: [{ title: 'Foraging Walk', image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=300&h=200&fit=crop', description: 'Foraging' }],
    rating: 4.9,
    reviewCount: 78,
    completedProjects: 156,
    responseTime: '< 6 hours',
    verification: 'Platinum' as const,
    isVerified: true,
    languages: ['English', 'Ojibwe'],
    location: 'Northern Minnesota',
    available: true,
    featured: false
  },

  // === YOUTH & EDUCATION ===
  {
    id: '31',
    title: 'Indigenous Youth Mentorship',
    description: 'One-on-one mentoring for Indigenous youth on identity, culture, and career paths.',
    freelancerId: 'f31',
    freelancerName: 'Youth Mentor',
    freelancerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
    freelancerNation: 'Lakota',
    category: 'youth-education',
    skills: ['Mentorship', 'Youth Development', 'Cultural Identity'],
    pricingTiers: [{ name: 'Hourly', price: 45, deliveryDays: 1, features: [] }],
    portfolio: [{ title: 'Youth Program', image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=300&h=200&fit=crop', description: 'Mentorship' }],
    rating: 4.9,
    reviewCount: 56,
    completedProjects: 89,
    responseTime: '< 4 hours',
    verification: 'Gold' as const,
    isVerified: true,
    languages: ['English', 'Lakota'],
    location: 'Rapid City, SD',
    available: true,
    featured: false
  },
  {
    id: '32',
    title: 'Indigenous Curriculum Development',
    description: 'Create Indigenous-focused K-12 educational materials and lesson plans.',
    freelancerId: 'f32',
    freelancerName: 'Curriculum Developer',
    freelancerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    freelancerNation: 'Navajo',
    category: 'youth-education',
    skills: ['Curriculum', 'Education', 'Indigenous Content'],
    pricingTiers: [{ name: 'Unit Package', price: 500, deliveryDays: 10, features: [] }],
    portfolio: [{ title: 'Curriculum Materials', image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=300&h=200&fit=crop', description: 'Education' }],
    rating: 4.7,
    reviewCount: 23,
    completedProjects: 34,
    responseTime: '< 12 hours',
    verification: 'Silver' as const,
    isVerified: true,
    languages: ['English', 'Navajo'],
    location: 'Window Rock, AZ',
    available: true,
    featured: false
  },

  // === CULTURAL GUIDANCE ===
  {
    id: '33',
    title: 'Sacred Site Protection Consulting',
    description: 'Consult on development impact and preservation strategies for sacred sites.',
    freelancerId: 'f33',
    freelancerName: 'Sacred Site Expert',
    freelancerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    freelancerNation: 'Various',
    category: 'cultural-guidance',
    skills: ['Sacred Sites', 'Preservation', 'Consulting'],
    pricingTiers: [{ name: 'Assessment', price: 350, deliveryDays: 7, features: [] }],
    portfolio: [{ title: 'Site Protection', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop', description: 'Preservation' }],
    rating: 4.9,
    reviewCount: 34,
    completedProjects: 45,
    responseTime: '< 12 hours',
    verification: 'Platinum' as const,
    isVerified: true,
    languages: ['English'],
    location: 'Various Locations',
    available: true,
    featured: false
  },
  {
    id: '34',
    title: 'Traditional Storytelling Performance',
    description: 'Traditional storytelling performances for events, schools, and cultural gatherings.',
    freelancerId: 'f34',
    freelancerName: 'Master Storyteller',
    freelancerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    freelancerNation: 'Cherokee',
    category: 'cultural-guidance',
    skills: ['Storytelling', 'Oral Tradition', 'Performance'],
    pricingTiers: [{ name: 'Performance', price: 500, deliveryDays: 1, features: [] }],
    portfolio: [{ title: 'Storytelling Event', image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=300&h=200&fit=crop', description: 'Performance' }],
    rating: 5.0,
    reviewCount: 89,
    completedProjects: 234,
    responseTime: '< 8 hours',
    verification: 'Platinum' as const,
    isVerified: true,
    languages: ['English', 'Cherokee', 'Muskogee'],
    location: 'Tahlequah, OK',
    available: true,
    featured: true
  },

  // === ENVIRONMENTAL STEWARDSHIP ===
  {
    id: '35',
    title: 'Traditional Burning Consulting',
    description: 'Advise on cultural fire practices and land management and controlled burns.',
    freelancerId: 'f35',
    freelancerName: 'Fire Knowledge Keeper',
    freelancerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    freelancerNation: 'Karuk',
    category: 'environmental',
    skills: ['Cultural Burning', 'Land Management', 'Fire Practices'],
    pricingTiers: [{ name: 'Daily Rate', price: 350, deliveryDays: 1, features: [] }],
    portfolio: [{ title: 'Prescribed Burn', image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&h=200&fit=crop', description: 'Fire management' }],
    rating: 4.9,
    reviewCount: 23,
    completedProjects: 34,
    responseTime: '< 24 hours',
    verification: 'Platinum' as const,
    isVerified: true,
    languages: ['English', 'Karuk'],
    location: 'Northern California',
    available: true,
    featured: false
  },
  {
    id: '36',
    title: 'Water Protection Monitoring',
    description: 'Monitor and advocate for water rights and protection of Indigenous water sources.',
    freelancerId: 'f36',
    freelancerName: 'Water Guardian',
    freelancerAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    freelancerNation: 'Anishinaabe',
    category: 'environmental',
    skills: ['Water Protection', 'Environmental Monitoring', 'Advocacy'],
    pricingTiers: [{ name: 'Hourly', price: 55, deliveryDays: 1, features: [] }],
    portfolio: [{ title: 'River Protection', image: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=300&h=200&fit=crop', description: 'Water monitoring' }],
    rating: 4.8,
    reviewCount: 45,
    completedProjects: 67,
    responseTime: '< 12 hours',
    verification: 'Gold' as const,
    isVerified: true,
    languages: ['English', 'Ojibwe'],
    location: 'Great Lakes Region',
    available: true,
    featured: false
  },
  {
    id: '37',
    title: 'Wildlife Tracking Expeditions',
    description: 'Lead wildlife tracking expeditions and teach traditional tracking methods.',
    freelancerId: 'f37',
    freelancerName: 'Tracker Expert',
    freelancerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    freelancerNation: 'Cree',
    category: 'environmental',
    skills: ['Wildlife Tracking', 'TEK', 'Guiding'],
    pricingTiers: [{ name: 'Expedition', price: 75, deliveryDays: 1, features: [] }],
    portfolio: [{ title: 'Tracking Expedition', image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&h=200&fit=crop', description: 'Wildlife' }],
    rating: 4.7,
    reviewCount: 34,
    completedProjects: 45,
    responseTime: '< 24 hours',
    verification: 'Silver' as const,
    isVerified: true,
    languages: ['English', 'Cree'],
    location: 'Saskatchewan',
    available: true,
    featured: false
  },
  {
    id: '38',
    title: 'Climate Adaptation Planning',
    description: 'Develop climate adaptation plans using Traditional Ecological Knowledge.',
    freelancerId: 'f38',
    freelancerName: 'Climate Planner',
    freelancerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
    freelancerNation: 'Inuit',
    category: 'environmental',
    skills: ['Climate Planning', 'TEK', 'Adaptation'],
    pricingTiers: [{ name: 'Plan Development', price: 2500, deliveryDays: 30, features: [] }],
    portfolio: [{ title: 'Community Plan', image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&h=200&fit=crop', description: 'Climate planning' }],
    rating: 4.9,
    reviewCount: 12,
    completedProjects: 18,
    responseTime: '< 48 hours',
    verification: 'Gold' as const,
    isVerified: true,
    languages: ['English', 'Inuktitut'],
    location: 'Nunavut',
    available: true,
    featured: false
  },

  // === CEREMONIAL & SPIRITUAL SERVICES ===
  {
    id: '39',
    title: 'Ceremony Facilitation',
    description: 'Lead traditional ceremonies including sweat lodges, pipe ceremonies, and healing circles.',
    freelancerId: 'f39',
    freelancerName: 'Ceremony Elder',
    freelancerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    freelancerNation: 'Lakota',
    category: 'ceremonial-spiritual',
    skills: ['Ceremony', 'Spiritual Guidance', 'Healing'],
    pricingTiers: [{ name: 'Sweat Lodge', price: 500, deliveryDays: 1, features: [] }],
    portfolio: [{ title: 'Ceremony', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop', description: 'Sacred ceremony' }],
    rating: 5.0,
    reviewCount: 89,
    completedProjects: 234,
    responseTime: '< 48 hours',
    verification: 'Platinum' as const,
    isVerified: true,
    languages: ['English', 'Lakota'],
    location: 'Pine Ridge, SD',
    available: true,
    featured: true
  },
  {
    id: '40',
    title: 'Naming Ceremonies',
    description: 'Facilitate traditional naming ceremonies for individuals and families.',
    freelancerId: 'f40',
    freelancerName: 'Naming Elder',
    freelancerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    freelancerNation: 'Navajo',
    category: 'ceremonial-spiritual',
    skills: ['Naming Ceremony', 'Traditional Practices', 'Spiritual'],
    pricingTiers: [{ name: 'Ceremony', price: 350, deliveryDays: 1, features: [] }],
    portfolio: [{ title: 'Naming Ceremony', image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=300&h=200&fit=crop', description: 'Ceremony' }],
    rating: 5.0,
    reviewCount: 45,
    completedProjects: 89,
    responseTime: '< 72 hours',
    verification: 'Platinum' as const,
    isVerified: true,
    languages: ['English', 'Navajo'],
    location: 'Window Rock, AZ',
    available: true,
    featured: false
  },
  {
    id: '41',
    title: 'Wedding Ceremonies (Traditional)',
    description: 'Officiate traditional Indigenous wedding ceremonies.',
    freelancerId: 'f41',
    freelancerName: 'Wedding Officiant',
    freelancerAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    freelancerNation: 'Cherokee',
    category: 'ceremonial-spiritual',
    skills: ['Wedding Ceremony', 'Officiating', 'Tradition'],
    pricingTiers: [{ name: 'Ceremony', price: 1000, deliveryDays: 1, features: [] }],
    portfolio: [{ title: 'Traditional Wedding', image: 'https://images.unsplash.com/photo-1519741497674-62228f5edced?w=300&h=200&fit=crop', description: 'Wedding' }],
    rating: 4.9,
    reviewCount: 34,
    completedProjects: 56,
    responseTime: '< 1 week',
    verification: 'Gold' as const,
    isVerified: true,
    languages: ['English', 'Cherokee'],
    location: 'Tahlequah, OK',
    available: true,
    featured: false
  },
  {
    id: '42',
    title: 'Coming of Age Ceremonies',
    description: 'Facilitate rites of passage ceremonies for youth and young adults.',
    freelancerId: 'f42',
    freelancerName: 'Rites Elder',
    freelancerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    freelancerNation: 'Lakota',
    category: 'ceremonial-spiritual',
    skills: ['Rites of Passage', 'Ceremony', 'Youth Guidance'],
    pricingTiers: [{ name: 'Ceremony', price: 1200, deliveryDays: 1, features: [] }],
    portfolio: [{ title: 'Coming of Age', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop', description: 'Rites of passage' }],
    rating: 5.0,
    reviewCount: 23,
    completedProjects: 45,
    responseTime: '< 1 week',
    verification: 'Platinum' as const,
    isVerified: true,
    languages: ['English', 'Lakota'],
    location: 'Standing Rock, ND',
    available: true,
    featured: false
  },
  {
    id: '43',
    title: 'Dream Interpretation',
    description: 'Traditional dream guidance and interpretation from Indigenous perspective.',
    freelancerId: 'f43',
    freelancerName: 'Dream Guide',
    freelancerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
    freelancerNation: 'Ojibwe',
    category: 'ceremonial-spiritual',
    skills: ['Dream Interpretation', 'Spiritual Guidance', 'Traditional Knowledge'],
    pricingTiers: [{ name: 'Session', price: 100, deliveryDays: 1, features: [] }],
    portfolio: [{ title: 'Dream Work', image: 'https://images.unsplash.com/photo-1531913764164-f85c52e6e654?w=300&h=200&fit=crop', description: 'Dream guidance' }],
    rating: 4.8,
    reviewCount: 56,
    completedProjects: 89,
    responseTime: '< 48 hours',
    verification: 'Gold' as const,
    isVerified: true,
    languages: ['English', 'Ojibwe'],
    location: 'Minneapolis, MN',
    available: true,
    featured: false
  },

  // === RESEARCH & ACADEMIC ===
  {
    id: '44',
    title: 'Community-Based Research',
    description: 'Conduct ethical research with Indigenous communities following cultural protocols.',
    freelancerId: 'f44',
    freelancerName: 'Research Lead',
    freelancerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    freelancerNation: 'MÃƒâ€žÃ‚Âori',
    category: 'research-academic',
    skills: ['Research', 'Community Engagement', 'Ethics'],
    pricingTiers: [{ name: 'Hourly', price: 75, deliveryDays: 1, features: [] }],
    portfolio: [{ title: 'Community Research', image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=300&h=200&fit=crop', description: 'Research' }],
    rating: 4.8,
    reviewCount: 23,
    completedProjects: 34,
    responseTime: '< 24 hours',
    verification: 'Gold' as const,
    isVerified: true,
    languages: ['English', 'Te Reo MÃƒâ€žÃ‚Âori'],
    location: 'Auckland, NZ',
    available: true,
    featured: false
  },
  {
    id: '45',
    title: 'Ethnobotanical Research',
    description: 'Document traditional plant knowledge and uses for academic and conservation purposes.',
    freelancerId: 'f45',
    freelancerName: 'Plant Researcher',
    freelancerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    freelancerNation: 'Haudenosaunee',
    category: 'research-academic',
    skills: ['Ethnobotany', 'Research', 'Plant Knowledge'],
    pricingTiers: [{ name: 'Project', price: 250, deliveryDays: 7, features: [] }],
    portfolio: [{ title: 'Plant Documentation', image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=300&h=200&fit=crop', description: 'Research' }],
    rating: 4.9,
    reviewCount: 34,
    completedProjects: 45,
    responseTime: '< 48 hours',
    verification: 'Gold' as const,
    isVerified: true,
    languages: ['English', 'Mohawk'],
    location: 'Upstate NY',
    available: true,
    featured: false
  },
  {
    id: '46',
    title: 'Genealogy Research',
    description: 'Trace Indigenous ancestry and family histories using archives and oral traditions.',
    freelancerId: 'f46',
    freelancerName: 'Genealogy Expert',
    freelancerAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    freelancerNation: 'Cherokee',
    category: 'research-academic',
    skills: ['Genealogy', 'Research', 'Archives'],
    pricingTiers: [{ name: 'Research Project', price: 150, deliveryDays: 14, features: [] }],
    portfolio: [{ title: 'Family History', image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=300&h=200&fit=crop', description: 'Genealogy' }],
    rating: 4.7,
    reviewCount: 45,
    completedProjects: 67,
    responseTime: '< 1 week',
    verification: 'Silver' as const,
    isVerified: true,
    languages: ['English', 'Cherokee'],
    location: 'Tahlequah, OK',
    available: true,
    featured: false
  },
  {
    id: '47',
    title: 'Guest Lecturing',
    description: 'Speak at universities and institutions on Indigenous topics, history, and culture.',
    freelancerId: 'f47',
    freelancerName: 'Professor Eagle',
    freelancerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    freelancerNation: 'Lakota',
    category: 'research-academic',
    skills: ['Lecturing', 'Academic', 'Indigenous Knowledge'],
    pricingTiers: [{ name: 'Lecture', price: 1500, deliveryDays: 1, features: [] }],
    portfolio: [{ title: 'University Lecture', image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=300&h=200&fit=crop', description: 'Academic' }],
    rating: 4.9,
    reviewCount: 56,
    completedProjects: 89,
    responseTime: '< 1 week',
    verification: 'Platinum' as const,
    isVerified: true,
    languages: ['English', 'Lakota'],
    location: 'Various Universities',
    available: true,
    featured: false
  }
];

// Price ranges for filter
const priceRanges = [
  { id: 'all', label: 'All Prices', min: 0, max: Infinity },
  { id: 'under-100', label: 'Under $100', min: 0, max: 99 },
  { id: '100-500', label: '$100 - $500', min: 100, max: 500 },
  { id: '500-1000', label: '$500 - $1,000', min: 500, max: 1000 },
  { id: 'over-1000', label: 'Over $1,000', min: 1001, max: Infinity },
];

const serviceStoryByCategory: Record<string, string> = {
  consulting: 'Guide respectful partnerships, cultural protocol, and community-first strategy.',
  'art-creative': 'Commission visual work and ceremonial design rooted in Indigenous authorship.',
  language: 'Help preserve Indigenous language through translation, tutoring, and narration services.',
  'storytelling-media': 'Shape films, audio, and media with Indigenous storytellers and producers.',
  'traditional-crafts': 'Work with makers carrying beadwork, regalia, and craft knowledge forward.',
  'performing-arts': 'Book performers and movement artists bringing ceremony and stage presence together.',
  'guiding-tourism': 'Partner with guides creating place-based cultural experiences and travel leadership.',
  'health-wellness': 'Support wellness work grounded in Indigenous care, healing, and practitioner knowledge.',
  'business-services': 'Hire Indigenous operators, strategists, and advisors for long-term growth.',
  'legal-advocacy': 'Access community-aware legal, policy, and advocacy support.',
  technology: 'Build with Indigenous technologists working across product, digital systems, and innovation.',
  'food-agriculture': 'Collaborate with land, food, and cultivation specialists rooted in stewardship.',
  'youth-education': 'Fund education, mentorship, and youth-centered learning outcomes.',
  'cultural-guidance': 'Bring elders, educators, and cultural guides into the work with clarity and care.',
  environmental: 'Work with land-based professionals focused on restoration, stewardship, and climate action.',
  'ceremonial-spiritual': 'Engage ceremony and spiritual guidance with respect, context, and trusted facilitation.',
  'research-academic': 'Partner on Indigenous research, archives, and academic knowledge systems.'
};

const curatedTalentGroups = [
  {
    title: 'Top Indigenous Designers',
    description: 'Brand, visual, and craft-led collaborators for organizations that need identity work with cultural integrity.',
    category: 'art-creative'
  },
  {
    title: 'Language Experts',
    description: 'Translation, teaching, and narration professionals helping communities and institutions keep language moving.',
    category: 'language'
  },
  {
    title: 'Cultural Consultants',
    description: 'Trusted advisors for protocol, engagement, land acknowledgments, and community-facing strategy.',
    category: 'consulting'
  }
];

const serviceActivityById: Record<string, { label: string; secondary: string }> = {
  '1': { label: 'Booked 12 times this month', secondary: '3 people viewing' },
  '2': { label: 'Recently hired by education teams', secondary: '5 people viewing' },
  '3': { label: 'Booked for land stewardship work', secondary: '2 people viewing' },
  '4': { label: 'Recently hired for campaign visuals', secondary: '4 people viewing' },
  '5': { label: 'Booked by two brand teams this week', secondary: '6 people viewing' },
  '6': { label: 'Reserved for upcoming ceremony season', secondary: '4 people viewing' },
  '7': { label: 'Recently hired for language archives', secondary: '5 people viewing' },
  '8': { label: 'Booked by three learners this week', secondary: '3 people viewing' },
  '9': { label: 'Recently hired for documentary audio', secondary: '7 people viewing' }
};

export default function FreelancingViewAll() {
  const router = useRouter();
  const [activePillar, setActivePillar] = useState('freelancing');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [verificationFilter, setVerificationFilter] = useState<string[]>([]);
  const [ownershipFilter, setOwnershipFilter] = useState<'all' | 'creator' | 'community'>('all');
  const [selectedService, setSelectedService] = useState<typeof allServices[0] | null>(null);
  const [savedServices, setSavedServices] = useState<Set<string>>(new Set());
  const [visibleCount, setVisibleCount] = useState(12);
  const [communityOffers, setCommunityOffers] = useState<CommunityMarketplaceOffer[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const serviceId = new URLSearchParams(window.location.search).get('service');
    if (!serviceId) return;
    const deepLinkedService = allServices.find((service) => service.id === serviceId);
    if (!deepLinkedService) return;
    setSelectedService(deepLinkedService);
  }, []);
  const categoryScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    fetchCommunityMarketplaceOffers({ pillar: 'freelancing', search: searchQuery || undefined })
      .then((offers) => {
        if (!cancelled) setCommunityOffers(offers);
      })
      .catch(() => {
        if (!cancelled) setCommunityOffers([]);
      });
    return () => {
      cancelled = true;
    };
  }, [searchQuery]);

  // Filter and sort services
  const filteredServices = useMemo(() => {
    let list = [...allServices];
    
    // Category filter
    if (activeCategory !== 'all') {
      list = list.filter(s => s.category === activeCategory);
    }
    
    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(s =>
        s.title.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.freelancerName.toLowerCase().includes(q) ||
        s.skills.some(skill => skill.toLowerCase().includes(q))
      );
    }
    
    // Price filter
    const priceRange = priceRanges.find(r => r.id === selectedPriceRange);
    if (priceRange && priceRange.id !== 'all') {
      list = list.filter(s => {
        const price = s.pricingTiers[0]?.price || 0;
        return price >= priceRange.min && price <= priceRange.max;
      });
    }
    
    // Verification filter
    if (verificationFilter.length > 0) {
      list = list.filter(s => verificationFilter.includes(s.verification));
    }
    
    // Sort
    if (sortBy === 'price-low') list.sort((a, b) => a.pricingTiers[0].price - b.pricingTiers[0].price);
    if (sortBy === 'price-high') list.sort((a, b) => b.pricingTiers[0].price - a.pricingTiers[0].price);
    if (sortBy === 'rating') list.sort((a, b) => b.rating - a.rating);
    if (sortBy === 'popular') list.sort((a, b) => b.completedProjects - a.completedProjects);
    
    if (ownershipFilter === 'community') {
      return [];
    }

    return list;
  }, [activeCategory, ownershipFilter, searchQuery, sortBy, selectedPriceRange, verificationFilter]);

  const visibleServices = filteredServices.slice(0, visibleCount);
  const featuredTalent = useMemo(() => {
    return allServices
      .filter((service) => service.featured || service.isVerified || service.completedProjects > 80)
      .slice(0, 3);
  }, []);
  const guidedSuggestions = useMemo(() => {
    const matches = activeCategory === 'all'
      ? allServices
      : allServices.filter((service) => service.category === activeCategory);
    return (matches.length ? matches : allServices).slice(0, 3);
  }, [activeCategory]);
  const curatedTalent = useMemo(() => {
    return curatedTalentGroups.map((group) => ({
      ...group,
      services: allServices.filter((service) => service.category === group.category).slice(0, 3)
    }));
  }, []);
  const filteredCommunityOffers = useMemo(() => {
    if (ownershipFilter === 'creator') return [];
    return communityOffers.slice(0, ownershipFilter === 'community' ? communityOffers.length : 2);
  }, [communityOffers, ownershipFilter]);
  const visibleCommunityOffers = useMemo(() => filteredCommunityOffers.slice(0, ownershipFilter === 'community' ? filteredCommunityOffers.length : 2), [filteredCommunityOffers, ownershipFilter]);
  const hasMore = ownershipFilter !== 'community' && filteredServices.length > visibleCount;

  const handlePillarChange = (pillarId: string) => {
    setActivePillar(pillarId);
    if (pillarId === 'digital-arts') {
      router.push('/');
    } else if (pillarId !== 'freelancing') {
      router.push(`/${pillarId}`);
    }
  };

  const toggleSave = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedServices(prev => {
      const s = new Set(prev);
      if (s.has(id)) { s.delete(id); } else { s.add(id); }
      return s;
    });
  };

  const scrollCategories = (direction: 'left' | 'right') => {
    if (categoryScrollRef.current) {
      const scroll = direction === 'left' ? -200 : 200;
      categoryScrollRef.current.scrollBy({ left: scroll, behavior: 'smooth' });
    }
  };

  const toggleVerification = (level: string) => {
    setVerificationFilter(prev => 
      prev.includes(level) 
        ? prev.filter(v => v !== level)
        : [...prev, level]
    );
  };

  return (
    <div className="flex min-h-screen bg-[#0a0a0a]">
      <Sidebar
        activePillar={activePillar}
        onPillarChange={handlePillarChange}
        isCollapsed={isCollapsed}
        onCollapseChange={setIsCollapsed}
      />
      
      <main className="flex-1 overflow-y-auto">
        <div className="p-6">
          <section className="mb-8 overflow-hidden rounded-[30px] border border-[#d4af37]/20 bg-[linear-gradient(135deg,rgba(36,27,10,0.96),rgba(12,12,12,0.98))] shadow-[0_18px_60px_rgba(0,0,0,0.32)]">
            <div className="grid gap-6 px-6 py-7 lg:grid-cols-[1.25fr_0.95fr] lg:px-8 lg:py-8">
              <div>
                <p className="text-[11px] uppercase tracking-[0.28em] text-[#d4af37]">Indigenous talent network</p>
                <h2 className="mt-3 max-w-3xl text-3xl font-semibold leading-tight text-white lg:text-4xl">
                  Work with Indigenous experts across culture, design, language, and community.
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-300">
                  Hire verified Indigenous professionals for consulting, creative work, language preservation, and community-facing projects while keeping trust, visibility, and long-term relationships at the center.
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {[
                    'Cultural consulting',
                    'Language preservation',
                    'Design and storytelling'
                  ].map((pill) => (
                    <span key={pill} className="rounded-full border border-[#d4af37]/20 bg-black/20 px-3 py-1.5 text-xs font-medium text-[#f4d47a]">
                      {pill}
                    </span>
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="#services-grid"
                    className="rounded-full bg-[#d4af37] px-5 py-3 text-sm font-semibold text-black transition-colors hover:bg-[#f4e4a6]"
                  >
                    Hire Talent
                  </Link>
                  <Link
                    href="/creator-hub/new/freelancing"
                    className="rounded-full border border-[#d4af37]/25 bg-black/20 px-5 py-3 text-sm font-semibold text-[#f4d47a] transition-colors hover:border-[#d4af37]/45 hover:bg-[#d4af37]/10"
                  >
                    Become a Creator
                  </Link>
                </div>

                <div className="mt-7 grid gap-3 sm:grid-cols-3">
                  {[
                    { value: '$4.8M', label: 'Paid directly to Indigenous professionals' },
                    { value: '312', label: 'Verified experts across disciplines' },
                    { value: '2.1K', label: 'Projects completed globally' }
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-2xl border border-white/8 bg-black/20 p-4">
                      <p className="text-xl font-bold text-white">{stat.value}</p>
                      <p className="mt-1 text-xs leading-5 text-gray-400">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-1">
                {featuredTalent.map((service, index) => (
                  <button
                    key={`hero-feature-${service.id}`}
                    onClick={() => setSelectedService(service)}
                    className={`overflow-hidden rounded-2xl border text-left transition-all hover:-translate-y-1 hover:border-[#d4af37]/45 ${
                      index === 0
                        ? 'border-[#d4af37]/25 bg-[#141414] md:col-span-2 lg:col-span-1'
                        : 'border-white/10 bg-[#141414]/90'
                    }`}
                  >
                    <div className={`relative ${index === 0 ? 'h-44' : 'h-36'}`}>
                      <img src={service.portfolio[0]?.image} alt={service.title} className="h-full w-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent" />
                      <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
                        <span className="rounded-full bg-[#d4af37] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-black">
                          Spotlight Creator
                        </span>
                        {service.featured && (
                          <span className="rounded-full border border-[#d4af37]/25 bg-black/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#f4d47a]">
                            Featured Service
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-white">{service.title}</h3>
                      <p className="mt-1 text-sm text-gray-400">{service.freelancerName} | {service.freelancerNation}</p>
                      <p className="mt-3 text-sm leading-6 text-gray-300">
                        {serviceStoryByCategory[service.category] || service.description}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="rounded-full border border-white/10 bg-black/20 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-gray-300">
                          {serviceActivityById[service.id]?.label || 'Recently hired'}
                        </span>
                        <span className="rounded-full border border-[#d4af37]/20 bg-[#d4af37]/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-[#f4d47a]">
                          {serviceActivityById[service.id]?.secondary || '2 people viewing'}
                        </span>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-3 text-xs text-gray-400">
                        <span>{service.completedProjects} completed projects</span>
                        <span>{service.rating} rating</span>
                        <span>{service.responseTime} response time</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="mb-8 grid gap-4 md:grid-cols-3">
            {[
              {
                title: 'Verified Indigenous experts',
                body: 'Hire professionals whose work, identity, and reputation are anchored in trusted creator and community signals.'
              },
              {
                title: 'Community-first, culturally aligned work',
                body: 'Projects can move with protocol, language, and place-based context built into the relationship from the start.'
              },
              {
                title: 'Direct support to creators and communities',
                body: 'Most earnings go straight to Indigenous professionals and the ecosystems that help them keep working long-term.'
              }
            ].map((reason) => (
              <div key={reason.title} className="rounded-2xl border border-white/10 bg-[#141414]/90 p-5">
                <p className="text-[11px] uppercase tracking-[0.26em] text-[#d4af37]">Why hire here</p>
                <h3 className="mt-3 text-lg font-semibold text-white">{reason.title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-400">{reason.body}</p>
              </div>
            ))}
          </section>

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white">Freelancing</h1>
              <p className="text-gray-400 text-sm">
                {filteredServices.length} services from Indigenous professionals
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search services, skills..."
                  className="bg-[#141414] border border-[#d4af37]/20 rounded-lg pl-9 pr-9 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#d4af37] w-64"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                    <X size={14} />
                  </button>
                )}
              </div>
              
              {/* Sort */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-[#141414] border border-[#d4af37]/20 rounded-lg px-4 py-2 pr-8 text-sm text-white focus:outline-none focus:border-[#d4af37] cursor-pointer"
                >
                  <option value="popular">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              
              {/* View Toggle */}
              <div className="flex items-center bg-[#141414] rounded-lg border border-[#d4af37]/20 p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded transition-colors ${viewMode === 'grid' ? 'bg-[#d4af37]/20 text-[#d4af37]' : 'text-gray-400 hover:text-white'}`}
                >
                  <Grid3X3 size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded transition-colors ${viewMode === 'list' ? 'bg-[#d4af37]/20 text-[#d4af37]' : 'text-gray-400 hover:text-white'}`}
                >
                  <List size={16} />
                </button>
              </div>
              
              {/* Filters Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                  showFilters ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#d4af37]' : 'bg-[#141414] border-[#d4af37]/20 text-gray-300 hover:border-[#d4af37]/50'
                }`}
              >
                <SlidersHorizontal size={16} />
                Filters
              </button>
            </div>
          </div>

          {/* Category Tabs with Scroll */}
          <div className="relative mb-6">
            <button
              onClick={() => scrollCategories('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-[#141414] border border-[#d4af37]/20 rounded-full text-gray-400 hover:text-white hover:border-[#d4af37]/50"
            >
              <ChevronLeft size={16} />
            </button>
            
            <div
              ref={categoryScrollRef}
              className="flex gap-2 overflow-x-auto scrollbar-hide px-8 py-1"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    activeCategory === category.id
                      ? 'bg-[#d4af37] text-black'
                      : 'bg-[#141414] text-gray-300 border border-[#d4af37]/20 hover:border-[#d4af37]/50 hover:text-white'
                  }`}
                >
                  <category.icon size={15} strokeWidth={2} />
                  <span>{category.name}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    activeCategory === category.id ? 'bg-black/20 text-black' : 'bg-[#d4af37]/20 text-[#d4af37]'
                  }`}>
                    {category.count}
                  </span>
                </button>
              ))}
            </div>
            
            <button
              onClick={() => scrollCategories('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-[#141414] border border-[#d4af37]/20 rounded-full text-gray-400 hover:text-white hover:border-[#d4af37]/50"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="bg-[#141414] border border-[#d4af37]/20 rounded-xl p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Price Range */}
                <div>
                  <h4 className="text-white font-medium mb-3">Price Range</h4>
                  <div className="space-y-2">
                    {priceRanges.map((range) => (
                      <button
                        key={range.id}
                        onClick={() => setSelectedPriceRange(range.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          selectedPriceRange === range.id
                            ? 'bg-[#d4af37]/20 text-[#d4af37]'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Verification Level */}
                <div>
                  <h4 className="text-white font-medium mb-3">Verification Level</h4>
                  <div className="space-y-2">
                    {['Platinum', 'Gold', 'Silver', 'Bronze'].map((level) => (
                      <button
                        key={level}
                        onClick={() => toggleVerification(level)}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                          verificationFilter.includes(level)
                            ? 'bg-[#d4af37]/20 text-[#d4af37]'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: verificationColors[level] }}
                        />
                        {level} Verified
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Availability */}
                <div>
                  <h4 className="text-white font-medium mb-3">Quick Filters</h4>
                  <div className="space-y-2">
                    <div className="rounded-lg border border-white/10 bg-black/20 p-3">
                      <p className="mb-2 text-xs uppercase tracking-[0.24em] text-gray-500">Ownership</p>
                      <div className="flex flex-wrap gap-2">
                        {([
                          ['all', 'All ownership'],
                          ['creator', 'Creator-owned'],
                          ['community', 'Community-owned']
                        ] as const).map(([value, label]) => (
                          <button
                            key={value}
                            type="button"
                            onClick={() => setOwnershipFilter(value)}
                            className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                              ownershipFilter === value
                                ? 'border-[#d4af37]/60 bg-[#d4af37]/20 text-[#f4d47a]'
                                : 'border-white/10 text-gray-400 hover:border-[#d4af37]/30 hover:text-white'
                            }`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                      Available Now
                    </button>
                    <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                      Response Time &lt; 4 hours
                    </button>
                    <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                      Featured Services
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Clear Filters */}
              <div className="flex justify-end mt-4 pt-4 border-t border-white/5">
                <button
                  onClick={() => {
                    setSelectedPriceRange('all');
                    setVerificationFilter([]);
                    setOwnershipFilter('all');
                    setSearchQuery('');
                    setActiveCategory('all');
                  }}
                  className="text-[#d4af37] text-sm hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            </div>
          )}

          {/* Results Count */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-400 text-sm">
              {ownershipFilter === 'community'
                ? `Showing ${visibleCommunityOffers.length} of ${filteredCommunityOffers.length} community-owned offers`
                : `Showing ${visibleServices.length} of ${filteredServices.length} services`}
            </p>
            {(selectedPriceRange !== 'all' || verificationFilter.length > 0 || searchQuery || ownershipFilter !== 'all') && (
              <div className="flex items-center gap-2">
                <span className="text-gray-500 text-sm">Active filters:</span>
                {ownershipFilter !== 'all' && (
                  <span className="px-2 py-1 bg-[#d4af37]/20 text-[#d4af37] text-xs rounded-full">
                    {ownershipFilter === 'creator' ? 'Creator-owned' : 'Community-owned'}
                  </span>
                )}
                {searchQuery && (
                  <span className="px-2 py-1 bg-[#d4af37]/20 text-[#d4af37] text-xs rounded-full">
                    Search: {searchQuery}
                  </span>
                )}
                {selectedPriceRange !== 'all' && (
                  <span className="px-2 py-1 bg-[#d4af37]/20 text-[#d4af37] text-xs rounded-full">
                    {priceRanges.find(r => r.id === selectedPriceRange)?.label}
                  </span>
                )}
                {verificationFilter.map(v => (
                  <span key={v} className="px-2 py-1 bg-[#d4af37]/20 text-[#d4af37] text-xs rounded-full">
                    {v}
                  </span>
                ))}
              </div>
            )}
          </div>

          {ownershipFilter !== 'community' && (
            <section className="mb-8 rounded-[28px] border border-[#d4af37]/15 bg-[linear-gradient(135deg,rgba(24,18,5,0.92),rgba(12,12,12,0.98))] p-5 md:p-6">
              <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.28em] text-[#d4af37]">Curated talent</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">Trusted Indigenous networks and specialists</h2>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-400">
                    Browse by expertise instead of getting dropped into a flat list. These are the services clients return to when the work requires trust, craft, and community awareness.
                  </p>
                </div>
                <Link
                  href="/community"
                  className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/20 bg-black/20 px-4 py-2 text-sm font-medium text-[#f4d47a] transition-colors hover:border-[#d4af37]/45 hover:bg-[#d4af37]/10"
                >
                  Join the community
                </Link>
              </div>

              <div className="grid gap-4 lg:grid-cols-3">
                {curatedTalent.map((group) => (
                  <div key={group.title} className="rounded-2xl border border-white/10 bg-[#141414]/90 p-4">
                    <h3 className="text-lg font-semibold text-white">{group.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-gray-400">{group.description}</p>
                    <div className="mt-4 space-y-3">
                      {group.services.map((service, index) => (
                        <button
                          key={service.id}
                          onClick={() => setSelectedService(service)}
                          className="flex w-full items-start gap-3 rounded-xl border border-white/8 bg-black/20 p-3 text-left transition-colors hover:border-[#d4af37]/30"
                        >
                          <img src={service.freelancerAvatar} alt={service.freelancerName} className="h-11 w-11 rounded-full object-cover" />
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              {index === 0 && (
                                <span className="rounded-full bg-[#d4af37]/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#f4d47a]">
                                  Spotlight Creator
                                </span>
                              )}
                              {service.featured && (
                                <span className="rounded-full border border-[#d4af37]/25 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#f4d47a]">
                                  Featured Service
                                </span>
                              )}
                            </div>
                            <p className="mt-2 truncate text-sm font-semibold text-white">{service.freelancerName}</p>
                            <p className="truncate text-xs text-gray-400">{service.title}</p>
                            <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-gray-500">
                              <span>{service.completedProjects} completed projects</span>
                              <span>{service.rating} rating</span>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Services Grid */}
          {filteredServices.length === 0 && filteredCommunityOffers.length === 0 ? (
            <div className="rounded-[28px] border border-[#d4af37]/15 bg-[linear-gradient(135deg,rgba(24,18,5,0.88),rgba(12,12,12,0.98))] p-6 md:p-8">
              <div className="flex flex-col items-center justify-center text-center">
                <Briefcase size={48} className="mb-4 text-gray-600" />
                <p className="text-lg font-semibold text-white">
                  {ownershipFilter === 'community' ? 'No community-owned offers found' : 'No services found'}
                </p>
                <p className="mb-5 mt-2 max-w-2xl text-sm leading-6 text-gray-400">
                  Nothing matched this exact search, so we pulled together trusted alternatives to keep the hiring journey moving.
                </p>
                <div className="mb-5 flex flex-wrap justify-center gap-2">
                  {categories.slice(1, 5).map((category) => (
                    <button
                      key={`empty-${category.id}`}
                      onClick={() => setActiveCategory(category.id)}
                      className="rounded-full border border-[#d4af37]/20 bg-black/20 px-3 py-1.5 text-xs font-medium text-[#f4d47a] transition-colors hover:border-[#d4af37]/40"
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
                <div className="grid w-full gap-4 md:grid-cols-3">
                  {guidedSuggestions.map((service) => (
                    <button
                      key={`guided-${service.id}`}
                      onClick={() => setSelectedService(service)}
                      className="overflow-hidden rounded-2xl border border-white/10 bg-[#141414]/90 text-left transition-colors hover:border-[#d4af37]/35"
                    >
                      <img src={service.portfolio[0]?.image} alt={service.title} className="h-36 w-full object-cover" />
                      <div className="p-4">
                        <p className="text-sm font-semibold text-white">{service.title}</p>
                        <p className="mt-2 text-xs leading-5 text-gray-400">{serviceStoryByCategory[service.category] || service.description}</p>
                        <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-gray-500">
                          <span>{service.freelancerName}</span>
                          <span>{service.completedProjects} projects</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => {
                    setActiveCategory('all');
                    setSearchQuery('');
                    setSelectedPriceRange('all');
                    setVerificationFilter([]);
                    setOwnershipFilter('all');
                  }}
                  className="mt-6 rounded-full bg-[#d4af37] px-5 py-3 text-sm font-semibold text-black transition-colors hover:bg-[#f4e4a6]"
                >
                  Clear all filters
                </button>
              </div>
            </div>
          ) : (
            <div id="services-grid" className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
            }`}>
              {ownershipFilter !== 'community' && visibleServices.map((service, idx) => (
                <div key={service.id} className="contents">
                  <ServiceCard
                    service={service}
                    viewMode={viewMode}
                    isSaved={savedServices.has(service.id)}
                    onToggleSave={(e) => toggleSave(service.id, e)}
                    onSelect={() => setSelectedService(service)}
                  />
                  {/* Inject sponsored card every 6 items */}
                  {(idx + 1) % 6 === 0 && idx < visibleServices.length - 1 && (
                    <SponsoredServiceCard key={`sponsored-${idx}`} />
                  )}
                  {(idx === 1 || (visibleServices.length === 1 && idx === 0)) && visibleCommunityOffers[0] ? (
                    <CommunityMarketplaceCard
                      key={`freelancing-community-${visibleCommunityOffers[0].id}`}
                      offer={visibleCommunityOffers[0]}
                      mode="mixed"
                      className="h-full"
                    />
                  ) : null}
                  {idx === 7 && visibleCommunityOffers[1] ? (
                    <CommunityMarketplaceCard
                      key={`freelancing-community-${visibleCommunityOffers[1].id}`}
                      offer={visibleCommunityOffers[1]}
                      mode="mixed"
                      className="h-full"
                    />
                  ) : null}
                  {((idx === 5 && visibleServices.length > 6) || (visibleServices.length <= 6 && idx === 2)) ? (
                    <FreelancingEditorialBreak
                      key={`editorial-break-${idx}`}
                      services={featuredTalent}
                      viewMode={viewMode}
                      onSelect={(picked) => setSelectedService(picked)}
                    />
                  ) : null}
                </div>
              ))}
              {(ownershipFilter === 'community' || visibleServices.length === 0)
                ? visibleCommunityOffers.map((offer) => (
                    <CommunityMarketplaceCard key={`freelancing-community-empty-${offer.id}`} offer={offer} mode="mixed" className="h-full" />
                  ))
                : null}
            </div>
          )}

          <section className="mt-10 rounded-[28px] border border-[#d4af37]/15 bg-[#141414] p-6">
            <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.28em] text-[#d4af37]">Trusted Indigenous networks</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Partner organizations and professional circles</h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-400">
                  Verified networks help clients hire with more confidence and give professionals stronger shared visibility across consulting, design, language, and community services.
                </p>
              </div>
              <Link
                href="/partnerships"
                className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/20 bg-black/20 px-4 py-2 text-sm font-medium text-[#f4d47a] transition-colors hover:border-[#d4af37]/45 hover:bg-[#d4af37]/10"
              >
                Explore partnerships
              </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {[
                { name: 'Indigenous Business Network', description: 'Consulting and advisory services', services: 45 },
                { name: 'First Nations Design Co-op', description: 'Design and branding collective', services: 28 },
                { name: 'Tribal Tech Solutions', description: 'Technology services', services: 67 },
                { name: 'Native Language Institute', description: 'Translation and preservation', services: 34 }
              ].map((partner) => (
                <div key={partner.name} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-sm font-semibold text-white">{partner.name}</p>
                  <p className="mt-2 text-sm text-gray-400">{partner.description}</p>
                  <p className="mt-4 text-xs uppercase tracking-[0.2em] text-[#d4af37]">{partner.services} services available</p>
                </div>
              ))}
            </div>
          </section>

          {/* Load More */}
          {hasMore && (
            <div className="mt-10 text-center">
              <button
                onClick={() => setVisibleCount(prev => prev + 12)}
                className="px-8 py-3 bg-[#141414] border border-[#d4af37]/30 rounded-full text-[#d4af37] font-medium hover:bg-[#d4af37]/10 hover:border-[#d4af37] transition-all"
              >
                Load More Services ({filteredServices.length - visibleCount} remaining)
              </button>
            </div>
          )}

          {/* Back to Marketplace */}
          <div className="mt-8 text-center">
            <Link
              href="/?pillar=freelancing"
              className="text-[#d4af37] text-sm hover:underline"
            >
              Back to Marketplace Overview
            </Link>
          </div>
        </div>
      </main>

      {/* Service Detail Modal */}
      {selectedService && (
        <ServiceDetailModal
          service={selectedService}
          onClose={() => setSelectedService(null)}
        />
      )}
    </div>
  );
}

// Service Card Component
function ServiceCard({
  service,
  viewMode,
  isSaved,
  onToggleSave,
  onSelect
}: {
  service: typeof allServices[0];
  viewMode: 'grid' | 'list';
  isSaved: boolean;
  onToggleSave: (e: React.MouseEvent) => void;
  onSelect: () => void;
}) {
  const lowestPrice = service.pricingTiers[0]?.price || 0;
  const verificationColor = verificationColors[service.verification];

  if (viewMode === 'list') {
    return (
      <div
        onClick={onSelect}
        className="group flex cursor-pointer overflow-hidden rounded-xl border border-[#d4af37]/20 bg-[#141414] transition-all hover:border-[#d4af37]/50"
      >
        <div className="relative w-48 flex-shrink-0">
          <img
            src={service.portfolio[0]?.image}
            alt={service.title}
            className="h-full w-full object-cover"
          />
          {service.featured && (
            <span className="absolute top-2 left-2 rounded bg-[#d4af37] px-2 py-1 text-xs font-semibold text-black">
              Featured Service
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-lg font-semibold text-white transition-colors group-hover:text-[#d4af37]">
                {service.title}
              </h3>
              <div className="mt-1 flex items-center gap-2">
                <img src={service.freelancerAvatar} alt={service.freelancerName} className="h-5 w-5 rounded-full object-cover" />
                <span className="text-sm text-gray-400">{service.freelancerName}</span>
                {service.isVerified && <BadgeCheck size={14} style={{ color: verificationColor }} />}
                <span className="text-xs text-gray-500">{service.freelancerNation}</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="rounded-full border border-[#d4af37]/20 bg-[#d4af37]/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#f4d47a]">
                  {service.featured ? 'Featured Service' : 'Verified Indigenous professional'}
                </span>
                <span className="rounded-full border border-white/10 bg-black/20 px-2.5 py-1 text-[10px] font-medium text-gray-300">
                  Top seller
                </span>
                <span className="rounded-full border border-white/10 bg-black/20 px-2.5 py-1 text-[10px] font-medium text-gray-300">
                  {service.completedProjects} completed projects
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-[#d4af37]">From ${lowestPrice}</p>
              <div className="mt-1 flex items-center justify-end gap-1">
                <Star size={12} className="fill-[#d4af37] text-[#d4af37]" />
                <span className="text-sm text-white">{service.rating}</span>
                <span className="text-xs text-gray-500">({service.reviewCount})</span>
              </div>
            </div>
          </div>

          <p className="mt-2 line-clamp-2 text-sm text-gray-400">{service.description}</p>
          <p className="mt-2 text-xs leading-5 text-gray-300">
            {serviceStoryByCategory[service.category] || service.description}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full border border-white/10 bg-black/20 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-gray-300">
              {serviceActivityById[service.id]?.label || 'Recently hired'}
            </span>
            <span className="rounded-full border border-[#d4af37]/20 bg-[#d4af37]/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-[#f4d47a]">
              {serviceActivityById[service.id]?.secondary || '2 people viewing'}
            </span>
          </div>

          <div className="mt-auto flex items-center justify-between pt-3">
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1"><Clock size={12} />{service.responseTime}</span>
              <span className="flex items-center gap-1"><CheckCircle size={12} />{service.completedProjects} jobs</span>
              <span className="flex items-center gap-1"><MapPin size={12} />{service.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect();
                }}
                className="rounded-lg bg-[#d4af37] px-3 py-2 text-xs font-semibold text-black transition-colors hover:bg-[#f4e4a6]"
              >
                View Details
              </button>
              <button onClick={onToggleSave} className={`rounded-lg p-2 transition-colors ${isSaved ? 'text-[#d4af37]' : 'text-gray-500 hover:text-white'}`}>
                <Heart size={16} fill={isSaved ? 'currentColor' : 'none'} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onSelect}
      className="group cursor-pointer overflow-hidden rounded-xl border border-[#d4af37]/20 bg-[#141414] transition-all hover:border-[#d4af37]/50"
    >
      <div className="relative aspect-video">
        <img
          src={service.portfolio[0]?.image}
          alt={service.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-2 top-2 flex flex-wrap gap-1.5">
          <span className="rounded bg-[#d4af37] px-2 py-1 text-xs font-semibold text-black">
            {service.featured ? 'Featured Service' : 'Sponsored Placement'}
          </span>
          <span className="rounded border border-[#d4af37]/25 bg-black/60 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#f4d47a]">
            New Launch
          </span>
        </div>

        <div className="absolute top-2 right-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={onToggleSave}
            className={`rounded-lg p-1.5 backdrop-blur-sm transition-colors ${
              isSaved ? 'bg-[#d4af37] text-black' : 'bg-black/50 text-white hover:bg-black/70'
            }`}
          >
            <Heart size={14} fill={isSaved ? 'currentColor' : 'none'} />
          </button>
        </div>

        <div
          className="absolute bottom-2 left-2 rounded-full px-2 py-1 text-xs font-semibold"
          style={{ backgroundColor: verificationColor, color: service.verification === 'Gold' ? 'black' : 'white' }}
        >
          {service.verification}
        </div>
      </div>

      <div className="p-4">
        <div className="mb-2 flex items-center gap-2">
          <img src={service.freelancerAvatar} alt={service.freelancerName} className="h-6 w-6 rounded-full object-cover border-2" style={{ borderColor: verificationColor }} />
          <span className="truncate text-sm text-gray-300">{service.freelancerName}</span>
          {service.isVerified && <BadgeCheck size={14} style={{ color: verificationColor }} />}
        </div>

        <div className="mb-2 flex flex-wrap gap-1.5">
          <span className="rounded-full border border-[#d4af37]/20 bg-[#d4af37]/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#f4d47a]">
            {service.featured ? 'Featured Service' : 'Verified Indigenous professional'}
          </span>
          <span className="rounded-full border border-white/10 bg-black/20 px-2 py-0.5 text-[10px] font-medium text-gray-300">
            Top seller
          </span>
          <span className="rounded-full border border-white/10 bg-black/20 px-2 py-0.5 text-[10px] font-medium text-gray-300">
            {service.completedProjects} completed projects
          </span>
        </div>

        <h3 className="mb-2 line-clamp-2 text-sm font-medium text-white transition-colors group-hover:text-[#d4af37]">
          {service.title}
        </h3>

        <p className="mb-3 text-xs leading-5 text-gray-300">
          {serviceStoryByCategory[service.category] || service.description}
        </p>

        <div className="mb-3 flex flex-wrap gap-2">
          <span className="rounded-full border border-white/10 bg-black/20 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-gray-300">
            {serviceActivityById[service.id]?.label || 'Recently hired'}
          </span>
          <span className="rounded-full border border-[#d4af37]/20 bg-[#d4af37]/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-[#f4d47a]">
            {serviceActivityById[service.id]?.secondary || '2 people viewing'}
          </span>
        </div>

        <div className="mb-3 flex flex-wrap gap-1">
          {service.skills.slice(0, 2).map((skill) => (
            <span key={skill} className="rounded-full bg-[#d4af37]/10 px-2 py-0.5 text-xs text-[#d4af37]">
              {skill}
            </span>
          ))}
          {service.skills.length > 2 && (
            <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-gray-400">
              +{service.skills.length - 2}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between gap-2">
          <div>
            <span className="text-xs text-gray-500">Starting at</span>
            <p className="font-bold text-[#d4af37]">${lowestPrice}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end gap-1">
              <Star size={12} className="fill-[#d4af37] text-[#d4af37]" />
              <span className="text-sm text-white">{service.rating}</span>
              <span className="text-xs text-gray-500">({service.reviewCount})</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelect();
              }}
              className="mt-2 rounded-lg bg-[#d4af37] px-3 py-1.5 text-xs font-semibold text-black transition-colors hover:bg-[#f4e4a6]"
            >
              View Details
            </button>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-3 border-t border-white/5 pt-3 text-xs text-gray-500">
          <span className="flex items-center gap-1"><Clock size={10} />{service.responseTime}</span>
          <span className="flex items-center gap-1"><CheckCircle size={10} />{service.completedProjects} jobs</span>
        </div>
      </div>
    </div>
  );
}

function FreelancingEditorialBreak({
  services,
  viewMode,
  onSelect
}: {
  services: typeof allServices;
  viewMode: 'grid' | 'list';
  onSelect: (service: typeof allServices[0]) => void;
}) {
  const picks = services.slice(0, 3);

  return (
    <section
      className={`rounded-[28px] border border-[#d4af37]/18 bg-[linear-gradient(135deg,rgba(24,18,5,0.96),rgba(12,12,12,0.98))] p-5 md:p-6 ${
        viewMode === 'grid' ? 'col-span-full my-2' : 'my-3'
      }`}
    >
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-[#d4af37]">Curated for organizations</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">Editor&apos;s picks for trusted cultural work</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-400">
            A quick reset in the scroll for teams hiring across language, design, consulting, and community-facing work.
          </p>
        </div>
        <Link
          href="/community"
          className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/20 bg-black/20 px-4 py-2 text-sm font-medium text-[#f4d47a] transition-colors hover:border-[#d4af37]/45 hover:bg-[#d4af37]/10"
        >
          View community feedback
        </Link>
      </div>

      <div className={`grid gap-4 ${viewMode === 'grid' ? 'md:grid-cols-3' : 'md:grid-cols-1 xl:grid-cols-3'}`}>
        {picks.map((service, index) => (
          <button
            key={`editor-pick-${service.id}`}
            onClick={() => onSelect(service)}
            className={`overflow-hidden rounded-2xl border text-left transition-all hover:-translate-y-1 hover:border-[#d4af37]/40 ${
              index === 0 ? 'border-[#d4af37]/30 bg-[#141414]' : 'border-white/10 bg-[#141414]/90'
            }`}
          >
            <div className="relative h-40">
              <img src={service.portfolio[0]?.image} alt={service.title} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
              <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
                <span className="rounded-full bg-[#d4af37] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-black">
                  Featured Service
                </span>
                <span className="rounded-full border border-[#d4af37]/25 bg-black/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#f4d47a]">
                  Spotlight Creator
                </span>
              </div>
            </div>
            <div className="p-4">
              <p className="text-sm font-semibold text-white">{service.title}</p>
              <p className="mt-1 text-xs text-gray-400">{service.freelancerName}</p>
              <p className="mt-3 text-sm leading-6 text-gray-300">
                {serviceStoryByCategory[service.category] || service.description}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full border border-white/10 bg-black/20 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-gray-300">
                  {serviceActivityById[service.id]?.label || 'Recently hired'}
                </span>
                <span className="rounded-full border border-[#d4af37]/20 bg-[#d4af37]/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-[#f4d47a]">
                  {serviceActivityById[service.id]?.secondary || '2 people viewing'}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}


