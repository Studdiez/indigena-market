/**
 * Event Management Service
 * Virtual and physical event ticketing
 */

class EventService {
  constructor() {
    this.events = new Map();
    this.tickets = new Map();
    this.registrations = new Map();
    this.checkIns = new Map();
  }

  async createEvent(organizerAddress, eventData) {
    const event = {
      eventId: this.generateId('EVT'),
      organizer: organizerAddress,
      title: eventData.title,
      description: eventData.description,
      type: eventData.type, // 'virtual', 'physical', 'hybrid'
      category: eventData.category,
      startDate: eventData.startDate,
      endDate: eventData.endDate,
      timezone: eventData.timezone || 'UTC',
      location: eventData.location || null, // For physical events
      virtualLink: eventData.virtualLink || null, // For virtual events
      image: eventData.image || null,
      capacity: eventData.capacity || null,
      price: eventData.price || 0,
      currency: eventData.currency || 'XRP',
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      registrations: 0,
      attendees: 0,
      speakers: eventData.speakers || [],
      agenda: eventData.agenda || [],
      sponsors: eventData.sponsors || []
    };

    this.events.set(event.eventId, event);

    return { success: true, eventId: event.eventId, event };
  }

  async publishEvent(eventId) {
    const event = this.events.get(eventId);
    if (!event) throw new Error('Event not found');

    event.status = 'published';
    event.publishedAt = new Date().toISOString();
    event.updatedAt = new Date().toISOString();

    return { success: true, eventId, status: 'published' };
  }

  async registerForEvent(eventId, userAddress, registrationData) {
    const event = this.events.get(eventId);
    if (!event) throw new Error('Event not found');
    if (event.status !== 'published') throw new Error('Event not open for registration');
    if (event.capacity && event.registrations >= event.capacity) {
      throw new Error('Event is sold out');
    }

    const registration = {
      registrationId: this.generateId('REG'),
      eventId,
      userAddress,
      ticketType: registrationData.ticketType || 'general',
      quantity: registrationData.quantity || 1,
      status: event.price > 0 ? 'pending_payment' : 'confirmed',
      registeredAt: new Date().toISOString(),
      paymentStatus: event.price > 0 ? 'pending' : 'not_required',
      checkedIn: false,
      checkInTime: null,
      specialRequests: registrationData.specialRequests || null
    };

    this.registrations.set(registration.registrationId, registration);
    event.registrations += registration.quantity;

    return {
      success: true,
      registrationId: registration.registrationId,
      status: registration.status,
      paymentRequired: event.price > 0
    };
  }

  async checkIn(eventId, registrationId, checkInData) {
    const event = this.events.get(eventId);
    if (!event) throw new Error('Event not found');

    const registration = this.registrations.get(registrationId);
    if (!registration) throw new Error('Registration not found');
    if (registration.eventId !== eventId) throw new Error('Registration does not match event');
    if (registration.checkedIn) throw new Error('Already checked in');

    registration.checkedIn = true;
    registration.checkInTime = new Date().toISOString();
    registration.checkInMethod = checkInData.method || 'manual';
    event.attendees++;

    return {
      success: true,
      registrationId,
      checkedInAt: registration.checkInTime,
      attendeeNumber: event.attendees
    };
  }

  async getEvent(eventId) {
    const event = this.events.get(eventId);
    if (!event) throw new Error('Event not found');

    return {
      ...event,
      spotsRemaining: event.capacity ? event.capacity - event.registrations : null,
      isSoldOut: event.capacity ? event.registrations >= event.capacity : false
    };
  }

  async getEvents(filters = {}) {
    let events = Array.from(this.events.values())
      .filter(e => e.status === 'published');

    if (filters.type) {
      events = events.filter(e => e.type === filters.type);
    }
    if (filters.category) {
      events = events.filter(e => e.category === filters.category);
    }
    if (filters.startDate) {
      events = events.filter(e => e.startDate >= filters.startDate);
    }
    if (filters.nation) {
      events = events.filter(e => e.nation === filters.nation);
    }

    events.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

    return events;
  }

  async getUserRegistrations(userAddress) {
    const registrations = Array.from(this.registrations.values())
      .filter(r => r.userAddress === userAddress);

    return registrations.map(r => {
      const event = this.events.get(r.eventId);
      return {
        ...r,
        event: event ? {
          eventId: event.eventId,
          title: event.title,
          startDate: event.startDate,
          type: event.type
        } : null
      };
    });
  }

  generateId(prefix) {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  }
}

module.exports = new EventService();
