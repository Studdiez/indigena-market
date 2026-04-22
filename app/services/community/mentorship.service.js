/**
 * Artist Mentorship Matching Service
 * Connects emerging artists with elders and master practitioners
 */

class MentorshipService {
  constructor() {
    this.mentors = new Map();
    this.mentees = new Map();
    this.matches = new Map();
    this.programs = new Map();
    this.applications = new Map();
    this.initializeMockData();
  }

  initializeMockData() {
    // Mock mentors (elders and master artists)
    const mockMentors = [
      {
        address: 'rMentor1NavajoXXXXXXXXXXXXXXXXXX',
        name: 'Grandmother Sarah Begay',
        nation: 'Navajo',
        expertise: ['weaving', 'sandpainting', 'natural_dyes'],
        experience: 45,
        availability: 'limited',
        maxMentees: 3,
        currentMentees: 2,
        bio: 'Master weaver with 45 years of experience in traditional Navajo techniques',
        teachingStyle: 'hands_on',
        languages: ['English', 'Navajo'],
        verified: true,
        rating: 4.9,
        totalMentees: 23
      },
      {
        address: 'rMentor2CherokeeXXXXXXXXXXXXXXXX',
        name: 'Chief William Crow',
        nation: 'Cherokee',
        expertise: ['pottery', 'storytelling', 'language'],
        experience: 38,
        availability: 'moderate',
        maxMentees: 5,
        currentMentees: 3,
        bio: 'Preserving Cherokee traditions through pottery and oral history',
        teachingStyle: 'discussion_based',
        languages: ['English', 'Cherokee'],
        verified: true,
        rating: 4.8,
        totalMentees: 31
      },
      {
        address: 'rMentor3HopiXXXXXXXXXXXXXXXXXXXX',
        name: 'Loren Kootswatewa',
        nation: 'Hopi',
        expertise: ['kachina_carving', 'pottery', 'agriculture'],
        experience: 52,
        availability: 'limited',
        maxMentees: 2,
        currentMentees: 1,
        bio: 'Kikmongwi and master carver teaching traditional Hopi arts',
        teachingStyle: 'apprenticeship',
        languages: ['English', 'Hopi'],
        verified: true,
        rating: 5.0,
        totalMentees: 15
      }
    ];

    mockMentors.forEach(mentor => {
      this.mentors.set(mentor.address, mentor);
    });
  }

  /**
   * Register as a mentor
   */
  async registerMentor(mentorData) {
    try {
      const {
        address,
        name,
        nation,
        expertise,
        experience,
        availability,
        maxMentees,
        bio,
        teachingStyle,
        languages
      } = mentorData;

      // Verify mentor credentials
      const verificationStatus = await this.verifyMentorCredentials(address, nation);

      if (!verificationStatus.verified) {
        return {
          success: false,
          message: 'Mentor verification failed',
          requirements: verificationStatus.requirements
        };
      }

      const mentor = {
        address,
        name,
        nation,
        expertise: Array.isArray(expertise) ? expertise : [expertise],
        experience: parseInt(experience),
        availability: availability || 'moderate',
        maxMentees: parseInt(maxMentees) || 3,
        currentMentees: 0,
        bio,
        teachingStyle: teachingStyle || 'flexible',
        languages: Array.isArray(languages) ? languages : ['English'],
        verified: true,
        rating: 0,
        totalMentees: 0,
        registeredAt: new Date().toISOString(),
        status: 'active'
      };

      this.mentors.set(address, mentor);

      return {
        success: true,
        message: 'Successfully registered as mentor',
        mentor: {
          address: mentor.address,
          name: mentor.name,
          expertise: mentor.expertise
        }
      };
    } catch (error) {
      console.error('Register mentor error:', error);
      throw error;
    }
  }

  /**
   * Apply for mentorship
   */
  async applyForMentorship(menteeAddress, applicationData) {
    try {
      const {
        preferredMentor,
        goals,
        experience,
        availability,
        nation,
        areasOfInterest,
        learningStyle,
        commitment
      } = applicationData;

      const application = {
        applicationId: this.generateApplicationId(),
        menteeAddress,
        preferredMentor,
        goals,
        experience: experience || 'beginner',
        availability: availability || 'flexible',
        nation,
        areasOfInterest: Array.isArray(areasOfInterest) ? areasOfInterest : [areasOfInterest],
        learningStyle: learningStyle || 'flexible',
        commitment: commitment || '3_months',
        status: 'pending',
        submittedAt: new Date().toISOString(),
        matches: []
      };

      // If preferred mentor specified, check availability
      if (preferredMentor) {
        const mentor = this.mentors.get(preferredMentor);
        if (mentor && mentor.currentMentees < mentor.maxMentees) {
          application.matches.push({
            mentorAddress: preferredMentor,
            matchScore: 100,
            reason: 'Preferred mentor available'
          });
        }
      }

      // Find additional matches
      const additionalMatches = await this.findMentorMatches(application);
      application.matches.push(...additionalMatches);

      // Sort by match score
      application.matches.sort((a, b) => b.matchScore - a.matchScore);

      this.applications.set(application.applicationId, application);

      return {
        success: true,
        applicationId: application.applicationId,
        status: 'pending',
        matchesFound: application.matches.length,
        topMatches: application.matches.slice(0, 3)
      };
    } catch (error) {
      console.error('Apply for mentorship error:', error);
      throw error;
    }
  }

  /**
   * Find mentor matches for an application
   */
  async findMentorMatches(application) {
    const matches = [];

    for (const [address, mentor] of this.mentors) {
      // Skip if mentor is at capacity
      if (mentor.currentMentees >= mentor.maxMentees) continue;

      // Skip if already preferred mentor
      if (address === application.preferredMentor) continue;

      let matchScore = 0;
      const reasons = [];

      // Nation match (highest priority)
      if (mentor.nation === application.nation) {
        matchScore += 30;
        reasons.push('Same nation');
      }

      // Expertise match
      const expertiseOverlap = mentor.expertise.filter(e => 
        application.areasOfInterest.includes(e)
      );
      matchScore += expertiseOverlap.length * 20;
      if (expertiseOverlap.length > 0) {
        reasons.push(`Expertise in: ${expertiseOverlap.join(', ')}`);
      }

      // Availability match
      if (mentor.availability === application.availability || 
          mentor.availability === 'flexible') {
        matchScore += 15;
        reasons.push('Compatible availability');
      }

      // Teaching/learning style match
      if (mentor.teachingStyle === application.learningStyle ||
          application.learningStyle === 'flexible') {
        matchScore += 10;
        reasons.push('Compatible teaching style');
      }

      // Language match
      const languageOverlap = mentor.languages.filter(l => 
        application.languages?.includes(l)
      );
      if (languageOverlap.length > 0) {
        matchScore += 10;
        reasons.push('Shared language');
      }

      // Mentor rating bonus
      matchScore += mentor.rating * 2;

      if (matchScore >= 40) {
        matches.push({
          mentorAddress: address,
          mentorName: mentor.name,
          mentorNation: mentor.nation,
          matchScore: Math.min(100, matchScore),
          reasons,
          mentor: {
            expertise: mentor.expertise,
            experience: mentor.experience,
            availability: mentor.availability,
            rating: mentor.rating
          }
        });
      }
    }

    return matches.sort((a, b) => b.matchScore - a.matchScore);
  }

  /**
   * Create mentorship match
   */
  async createMatch(applicationId, mentorAddress, matchData) {
    try {
      const application = this.applications.get(applicationId);
      if (!application) {
        throw new Error('Application not found');
      }

      const mentor = this.mentors.get(mentorAddress);
      if (!mentor) {
        throw new Error('Mentor not found');
      }

      if (mentor.currentMentees >= mentor.maxMentees) {
        throw new Error('Mentor is at capacity');
      }

      const match = {
        matchId: this.generateMatchId(),
        applicationId,
        menteeAddress: application.menteeAddress,
        mentorAddress,
        status: 'active',
        createdAt: new Date().toISOString(),
        goals: application.goals,
        schedule: matchData.schedule || {},
        milestones: this.generateMilestones(application),
        sessions: [],
        progress: {
          completedMilestones: 0,
          totalMilestones: 0,
          lastSession: null,
          nextSession: null
        }
      };

      // Update mentor count
      mentor.currentMentees++;

      // Update application
      application.status = 'matched';
      application.matchedAt = new Date().toISOString();

      this.matches.set(match.matchId, match);

      // Notify both parties
      await this.notifyMatchCreated(match);

      return {
        success: true,
        matchId: match.matchId,
        mentor: {
          name: mentor.name,
          address: mentor.address
        },
        message: 'Mentorship match created successfully'
      };
    } catch (error) {
      console.error('Create match error:', error);
      throw error;
    }
  }

  /**
   * Schedule mentorship session
   */
  async scheduleSession(matchId, sessionData) {
    try {
      const match = this.matches.get(matchId);
      if (!match) {
        throw new Error('Match not found');
      }

      const session = {
        sessionId: this.generateSessionId(),
        matchId,
        scheduledAt: sessionData.scheduledAt,
        duration: sessionData.duration || 60, // minutes
        topic: sessionData.topic,
        format: sessionData.format || 'video_call',
        status: 'scheduled',
        notes: null,
        createdAt: new Date().toISOString()
      };

      match.sessions.push(session);
      match.progress.nextSession = session.scheduledAt;

      return {
        success: true,
        sessionId: session.sessionId,
        scheduledAt: session.scheduledAt,
        message: 'Session scheduled successfully'
      };
    } catch (error) {
      console.error('Schedule session error:', error);
      throw error;
    }
  }

  /**
   * Record session completion
   */
  async completeSession(matchId, sessionId, completionData) {
    try {
      const match = this.matches.get(matchId);
      if (!match) {
        throw new Error('Match not found');
      }

      const session = match.sessions.find(s => s.sessionId === sessionId);
      if (!session) {
        throw new Error('Session not found');
      }

      session.status = 'completed';
      session.completedAt = new Date().toISOString();
      session.notes = completionData.notes;
      session.outcomes = completionData.outcomes || [];
      session.rating = completionData.rating;

      // Update progress
      match.progress.lastSession = session.completedAt;
      match.progress.nextSession = null;

      // Check for milestone completion
      if (completionData.milestoneCompleted) {
        const milestone = match.milestones.find(m => m.id === completionData.milestoneCompleted);
        if (milestone) {
          milestone.status = 'completed';
          milestone.completedAt = session.completedAt;
          match.progress.completedMilestones++;
        }
      }

      return {
        success: true,
        sessionId,
        completedAt: session.completedAt,
        progress: match.progress
      };
    } catch (error) {
      console.error('Complete session error:', error);
      throw error;
    }
  }

  /**
   * Get mentorship dashboard for a user
   */
  async getMentorshipDashboard(userAddress) {
    try {
      // Check if user is a mentor
      const mentorProfile = this.mentors.get(userAddress);
      
      // Get mentee applications
      const applications = Array.from(this.applications.values())
        .filter(a => a.menteeAddress === userAddress);

      // Get active matches
      const activeMatches = Array.from(this.matches.values())
        .filter(m => m.menteeAddress === userAddress || m.mentorAddress === userAddress);

      const dashboard = {
        userAddress,
        role: mentorProfile ? 'mentor' : 'mentee',
        mentorProfile: mentorProfile || null,
        applications: applications.map(a => ({
          applicationId: a.applicationId,
          status: a.status,
          submittedAt: a.submittedAt,
          matchesFound: a.matches.length
        })),
        activeMatches: activeMatches.map(m => ({
          matchId: m.matchId,
          mentorAddress: m.mentorAddress,
          menteeAddress: m.menteeAddress,
          status: m.status,
          createdAt: m.createdAt,
          progress: m.progress,
          upcomingSessions: m.sessions.filter(s => s.status === 'scheduled').length
        }))
      };

      return dashboard;
    } catch (error) {
      console.error('Get dashboard error:', error);
      throw error;
    }
  }

  /**
   * Get available mentors
   */
  async getAvailableMentors(filters = {}) {
    try {
      const { nation, expertise, availability } = filters;

      let mentors = Array.from(this.mentors.values())
        .filter(m => m.currentMentees < m.maxMentees);

      if (nation) {
        mentors = mentors.filter(m => m.nation.toLowerCase() === nation.toLowerCase());
      }

      if (expertise) {
        mentors = mentors.filter(m => m.expertise.includes(expertise));
      }

      if (availability) {
        mentors = mentors.filter(m => m.availability === availability);
      }

      return mentors.map(m => ({
        address: m.address,
        name: m.name,
        nation: m.nation,
        expertise: m.expertise,
        experience: m.experience,
        availability: m.availability,
        rating: m.rating,
        openSlots: m.maxMentees - m.currentMentees
      }));
    } catch (error) {
      console.error('Get available mentors error:', error);
      throw error;
    }
  }

  /**
   * End mentorship
   */
  async endMentorship(matchId, endData) {
    try {
      const match = this.matches.get(matchId);
      if (!match) {
        throw new Error('Match not found');
      }

      match.status = 'completed';
      match.endedAt = new Date().toISOString();
      match.endReason = endData.reason;
      match.finalNotes = endData.notes;
      match.outcomes = endData.outcomes || [];

      // Update mentor count
      const mentor = this.mentors.get(match.mentorAddress);
      if (mentor) {
        mentor.currentMentees--;
        mentor.totalMentees++;
      }

      // Generate completion certificate
      match.certificate = {
        certificateId: this.generateCertificateId(),
        issuedAt: match.endedAt,
        mentorName: mentor?.name,
        menteeAddress: match.menteeAddress,
        duration: this.calculateDuration(match.createdAt, match.endedAt),
        skills: mentor?.expertise || []
      };

      return {
        success: true,
        matchId,
        status: 'completed',
        certificate: match.certificate
      };
    } catch (error) {
      console.error('End mentorship error:', error);
      throw error;
    }
  }

  /**
   * Get mentorship statistics
   */
  async getMentorshipStats() {
    const matches = Array.from(this.matches.values());
    const mentors = Array.from(this.mentors.values());

    return {
      totalMentors: mentors.length,
      activeMentors: mentors.filter(m => m.currentMentees > 0).length,
      totalMatches: matches.length,
      activeMatches: matches.filter(m => m.status === 'active').length,
      completedMatches: matches.filter(m => m.status === 'completed').length,
      totalSessions: matches.reduce((sum, m) => sum + m.sessions.length, 0),
      averageRating: mentors.reduce((sum, m) => sum + m.rating, 0) / mentors.length || 0,
      byNation: this.groupByNation(mentors),
      byExpertise: this.groupByExpertise(mentors)
    };
  }

  // Helper methods
  generateApplicationId() {
    return `APP-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  }

  generateMatchId() {
    return `MTC-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  }

  generateSessionId() {
    return `SES-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  }

  generateCertificateId() {
    return `CER-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  }

  async verifyMentorCredentials(address, nation) {
    // In production: Check verification status from KYC service
    return {
      verified: true,
      requirements: []
    };
  }

  generateMilestones(application) {
    const baseMilestones = [
      { id: 'intro', title: 'Introduction & Goal Setting', description: 'Establish relationship and set learning goals' },
      { id: 'foundation', title: 'Foundation Skills', description: 'Learn basic techniques and principles' },
      { id: 'practice', title: 'Guided Practice', description: 'Practice with mentor feedback' },
      { id: 'project', title: 'Independent Project', description: 'Complete a project independently' },
      { id: 'review', title: 'Final Review', description: 'Review progress and plan next steps' }
    ];

    return baseMilestones.map((m, index) => ({
      ...m,
      order: index,
      status: 'pending',
      targetDate: null,
      completedAt: null
    }));
  }

  async notifyMatchCreated(match) {
    console.log(`Match created: ${match.matchId}`);
    // In production: Send notifications to both parties
  }

  calculateDuration(start, end) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${Math.floor(diffDays / 30)} months`;
  }

  groupByNation(mentors) {
    const grouped = {};
    mentors.forEach(m => {
      grouped[m.nation] = (grouped[m.nation] || 0) + 1;
    });
    return grouped;
  }

  groupByExpertise(mentors) {
    const grouped = {};
    mentors.forEach(m => {
      m.expertise.forEach(e => {
        grouped[e] = (grouped[e] || 0) + 1;
      });
    });
    return grouped;
  }
}

module.exports = new MentorshipService();
