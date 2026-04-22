/**
 * PILLAR 6: CULTURAL TOURISM
 * Experience and connection marketplace
 */

class CulturalTourismService {
  constructor() {
    this.experiences = new Map();
    this.bookings = new Map();
    this.accommodations = new Map();
    this.festivals = new Map();
  }

  async createExperience(host, experienceData) {
    const experience = {
      experienceId: this.generateId('EXP'),
      pillar: 'cultural_tourism',
      host: host,
      type: experienceData.type, // 'workshop', 'tour', 'ceremony', 'meal', 'performance'
      title: experienceData.title,
      description: experienceData.description,
      location: {
        nation: experienceData.nation,
        community: experienceData.community,
        address: experienceData.address,
        coordinates: experienceData.coordinates,
        directions: experienceData.directions
      },
      duration: experienceData.duration, // minutes
      groupSize: {
        min: experienceData.minGroupSize || 1,
        max: experienceData.maxGroupSize || 10,
        privateAvailable: experienceData.privateAvailable || false
      },
      schedule: {
        availability: experienceData.availability || [],
        seasonal: experienceData.seasonal || false,
        seasonMonths: experienceData.seasonMonths || []
      },
      pricing: {
        adult: experienceData.adultPrice,
        child: experienceData.childPrice || null,
        senior: experienceData.seniorPrice || null,
        group: experienceData.groupPrice || null,
        currency: experienceData.currency || 'INDI'
      },
      cultural: {
        protocols: experienceData.protocols || [],
        whatToBring: experienceData.whatToBring || [],
        accessibility: experienceData.accessibility || [],
        photography: experienceData.photographyPolicy || 'ask_first'
      },
      media: {
        images: experienceData.images || [],
        video: experienceData.video || null
      },
      reviews: [],
      stats: {
        totalBookings: 0,
        rating: 0,
        reviewCount: 0
      },
      status: 'active',
      createdAt: new Date().toISOString()
    };

    this.experiences.set(experience.experienceId, experience);

    return {
      success: true,
      experienceId: experience.experienceId,
      status: experience.status
    };
  }

  async createAccommodation(host, accommodationData) {
    const accommodation = {
      accommodationId: this.generateId('ACC'),
      pillar: 'cultural_tourism',
      host: host,
      type: accommodationData.type, // 'homestay', 'cabin', 'campground', 'lodge'
      title: accommodationData.title,
      description: accommodationData.description,
      location: {
        nation: accommodationData.nation,
        community: accommodationData.community,
        address: accommodationData.address,
        nearAttractions: accommodationData.nearAttractions || []
      },
      amenities: accommodationData.amenities || [],
      rooms: accommodationData.rooms || [{
        type: 'standard',
        capacity: accommodationData.capacity || 2,
        beds: accommodationData.beds || 1,
        pricePerNight: accommodationData.pricePerNight
      }],
      pricing: {
        basePrice: accommodationData.pricePerNight,
        cleaningFee: accommodationData.cleaningFee || 0,
        currency: accommodationData.currency || 'INDI'
      },
      houseRules: accommodationData.houseRules || [],
      cultural: {
        traditionalElements: accommodationData.traditionalElements || [],
        stories: accommodationData.stories || [],
        activitiesIncluded: accommodationData.activitiesIncluded || []
      },
      calendar: {
        availability: accommodationData.availability || [],
        minimumStay: accommodationData.minimumStay || 1,
        maximumStay: accommodationData.maximumStay || 14
      },
      status: 'active',
      createdAt: new Date().toISOString()
    };

    this.accommodations.set(accommodation.accommodationId, accommodation);

    return {
      success: true,
      accommodationId: accommodation.accommodationId,
      status: accommodation.status
    };
  }

  async createFestival(organizer, festivalData) {
    const festival = {
      festivalId: this.generateId('FEST'),
      pillar: 'cultural_tourism',
      organizer: organizer,
      name: festivalData.name,
      description: festivalData.description,
      nation: festivalData.nation,
      location: {
        venue: festivalData.venue,
        address: festivalData.address,
        coordinates: festivalData.coordinates
      },
      dates: {
        start: festivalData.startDate,
        end: festivalData.endDate,
        setup: festivalData.setupDate || null
      },
      schedule: festivalData.schedule || [],
      ticketTypes: festivalData.ticketTypes || [
        { name: 'Day Pass', price: 25, includes: ['general_access'] },
        { name: 'Full Festival', price: 75, includes: ['all_days', 'camping'] },
        { name: 'VIP', price: 150, includes: ['all_access', 'meals', 'merchandise'] }
      ],
      activities: festivalData.activities || [],
      vendors: festivalData.vendors || [],
      media: {
        images: festivalData.images || [],
        video: festivalData.video || null
      },
      status: 'upcoming', // 'upcoming', 'active', 'completed', 'cancelled'
      createdAt: new Date().toISOString()
    };

    this.festivals.set(festival.festivalId, festival);

    return {
      success: true,
      festivalId: festival.festivalId,
      status: festival.status
    };
  }

  async bookExperience(user, experienceId, bookingData) {
    const experience = this.experiences.get(experienceId);
    if (!experience) throw new Error('Experience not found');

    const booking = {
      bookingId: this.generateId('BKG'),
      pillar: 'cultural_tourism',
      user: user,
      type: 'experience',
      itemId: experienceId,
      itemTitle: experience.title,
      date: bookingData.date,
      time: bookingData.time,
      groupSize: bookingData.groupSize || 1,
      pricing: {
        basePrice: experience.pricing.adult * (bookingData.groupSize || 1),
        fees: 0,
        total: experience.pricing.adult * (bookingData.groupSize || 1)
      },
      specialRequests: bookingData.specialRequests || null,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };

    this.bookings.set(booking.bookingId, booking);
    experience.stats.totalBookings++;

    return {
      success: true,
      bookingId: booking.bookingId,
      experience: experience.title,
      date: booking.date,
      total: booking.pricing.total
    };
  }

  async bookAccommodation(user, accommodationId, bookingData) {
    const accommodation = this.accommodations.get(accommodationId);
    if (!accommodation) throw new Error('Accommodation not found');

    const nights = this.calculateNights(bookingData.checkIn, bookingData.checkOut);
    const total = (accommodation.pricing.basePrice * nights) + accommodation.pricing.cleaningFee;

    const booking = {
      bookingId: this.generateId('BKG'),
      pillar: 'cultural_tourism',
      user: user,
      type: 'accommodation',
      itemId: accommodationId,
      itemTitle: accommodation.title,
      checkIn: bookingData.checkIn,
      checkOut: bookingData.checkOut,
      nights: nights,
      guests: bookingData.guests || 1,
      pricing: {
        nightlyRate: accommodation.pricing.basePrice,
        nights: nights,
        subtotal: accommodation.pricing.basePrice * nights,
        cleaningFee: accommodation.pricing.cleaningFee,
        total: total
      },
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };

    this.bookings.set(booking.bookingId, booking);

    return {
      success: true,
      bookingId: booking.bookingId,
      accommodation: accommodation.title,
      nights: nights,
      total: total
    };
  }

  async buyFestivalTicket(user, festivalId, ticketData) {
    const festival = this.festivals.get(festivalId);
    if (!festival) throw new Error('Festival not found');

    const ticketType = festival.ticketTypes.find(t => t.name === ticketData.ticketType);
    if (!ticketType) throw new Error('Ticket type not found');

    const booking = {
      bookingId: this.generateId('BKG'),
      pillar: 'cultural_tourism',
      user: user,
      type: 'festival',
      itemId: festivalId,
      itemTitle: festival.name,
      ticketType: ticketData.ticketType,
      quantity: ticketData.quantity || 1,
      pricing: {
        unitPrice: ticketType.price,
        quantity: ticketData.quantity || 1,
        total: ticketType.price * (ticketData.quantity || 1)
      },
      status: 'confirmed',
      ticketCode: this.generateTicketCode(),
      createdAt: new Date().toISOString()
    };

    this.bookings.set(booking.bookingId, booking);

    return {
      success: true,
      bookingId: booking.bookingId,
      festival: festival.name,
      ticketType: ticketData.ticketType,
      ticketCode: booking.ticketCode,
      total: booking.pricing.total
    };
  }

  async getExperiences(filters = {}) {
    let experiences = Array.from(this.experiences.values())
      .filter(e => e.status === 'active');

    if (filters.nation) experiences = experiences.filter(e => e.location.nation === filters.nation);
    if (filters.type) experiences = experiences.filter(e => e.type === filters.type);
    if (filters.date) {
      // Filter by availability on date
      experiences = experiences.filter(e => 
        e.schedule.availability.some(a => a.date === filters.date)
      );
    }

    return experiences.map(e => ({
      experienceId: e.experienceId,
      title: e.title,
      type: e.type,
      thumbnail: e.media.images[0],
      nation: e.location.nation,
      duration: e.duration,
      price: e.pricing.adult,
      rating: e.stats.rating,
      groupSize: e.groupSize
    }));
  }

  calculateNights(checkIn, checkOut) {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  }

  generateTicketCode() {
    return 'TKT-' + Math.random().toString(36).substr(2, 8).toUpperCase();
  }

  generateId(prefix) {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  }
}

module.exports = new CulturalTourismService();
