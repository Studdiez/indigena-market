/**
 * PILLAR 3: COURSES
 * Knowledge as economy - educational marketplace
 */

class CoursesService {
  constructor() {
    this.courses = new Map();
    this.enrollments = new Map();
    this.certificates = new Map();
  }

  async createCourse(instructor, courseData) {
    const course = {
      courseId: this.generateId('CRS'),
      pillar: 'courses',
      instructor: instructor,
      title: courseData.title,
      subtitle: courseData.subtitle,
      description: courseData.description,
      category: courseData.category, // 'language', 'craft', 'history', 'business', 'spiritual'
      level: courseData.level || 'beginner', // 'beginner', 'intermediate', 'advanced', 'all_levels'
      content: {
        modules: courseData.modules || [],
        totalLessons: courseData.totalLessons || 0,
        totalDuration: courseData.totalDuration || 0, // minutes
        resources: courseData.resources || []
      },
      pricing: {
        basePrice: courseData.basePrice,
        currency: courseData.currency || 'INDI',
        elderRate: courseData.elderRate || 0.5, // 50% discount for elders
        studentRate: courseData.studentRate || 0.7,
        communityRate: courseData.communityRate || 0.8
      },
      access: {
        type: courseData.accessType || 'lifetime', // 'lifetime', 'subscription', 'rental'
        duration: courseData.accessDuration || null
      },
      certification: {
        enabled: courseData.certificationEnabled !== false,
        certificateType: courseData.certificateType || 'completion',
        accreditedBy: courseData.accreditedBy || null,
        skills: courseData.skills || []
      },
      cultural: {
        nation: courseData.nation,
        eldersInvolved: courseData.eldersInvolved || [],
        traditionalKnowledge: courseData.traditionalKnowledge || false,
        protocols: courseData.protocols || []
      },
      engagement: {
        discussions: true,
        assignments: courseData.hasAssignments || false,
        liveSessions: courseData.hasLiveSessions || false,
        mentorship: courseData.hasMentorship || false
      },
      status: courseData.status || 'draft',
      publishedAt: null,
      stats: {
        enrollments: 0,
        completions: 0,
        rating: 0,
        reviews: 0
      },
      createdAt: new Date().toISOString()
    };

    this.courses.set(course.courseId, course);

    return {
      success: true,
      courseId: course.courseId,
      status: course.status
    };
  }

  async enrollStudent(courseId, student, enrollmentData) {
    const course = this.courses.get(courseId);
    if (!course) throw new Error('Course not found');

    // Calculate price based on eligibility
    let price = course.pricing.basePrice;
    let rateApplied = 'standard';

    if (enrollmentData.elder) {
      price = price * course.pricing.elderRate;
      rateApplied = 'elder';
    } else if (enrollmentData.student) {
      price = price * course.pricing.studentRate;
      rateApplied = 'student';
    } else if (enrollmentData.communityMember) {
      price = price * course.pricing.communityRate;
      rateApplied = 'community';
    }

    const enrollment = {
      enrollmentId: this.generateId('ENR'),
      courseId: courseId,
      student: student,
      price: price,
      rateApplied: rateApplied,
      status: 'active',
      progress: {
        completedLessons: [],
        percentComplete: 0,
        lastAccessed: new Date().toISOString()
      },
      certificate: null,
      enrolledAt: new Date().toISOString(),
      completedAt: null
    };

    this.enrollments.set(enrollment.enrollmentId, enrollment);
    course.stats.enrollments++;

    return {
      success: true,
      enrollmentId: enrollment.enrollmentId,
      price: price,
      rateApplied: rateApplied
    };
  }

  async completeLesson(enrollmentId, lessonId) {
    const enrollment = this.enrollments.get(enrollmentId);
    if (!enrollment) throw new Error('Enrollment not found');

    if (!enrollment.progress.completedLessons.includes(lessonId)) {
      enrollment.progress.completedLessons.push(lessonId);
    }

    // Check if course complete
    const course = this.courses.get(enrollment.courseId);
    const totalLessons = course.content.totalLessons;
    enrollment.progress.percentComplete = 
      Math.round((enrollment.progress.completedLessons.length / totalLessons) * 100);

    if (enrollment.progress.percentComplete >= 100) {
      await this.completeCourse(enrollmentId);
    }

    return {
      success: true,
      percentComplete: enrollment.progress.percentComplete
    };
  }

  async completeCourse(enrollmentId) {
    const enrollment = this.enrollments.get(enrollmentId);
    const course = this.courses.get(enrollment.courseId);

    enrollment.status = 'completed';
    enrollment.completedAt = new Date().toISOString();
    course.stats.completions++;

    // Generate certificate
    if (course.certification.enabled) {
      const certificate = {
        certificateId: this.generateId('CERT'),
        enrollmentId: enrollmentId,
        courseId: enrollment.courseId,
        student: enrollment.student,
        courseName: course.title,
        instructor: course.instructor,
        issueDate: new Date().toISOString(),
        skills: course.certification.skills,
        verificationUrl: `https://indigenamarket.com/verify/${this.generateId('CERT')}`
      };

      this.certificates.set(certificate.certificateId, certificate);
      enrollment.certificate = certificate.certificateId;
    }

    return {
      success: true,
      completed: true,
      certificate: enrollment.certificate
    };
  }

  async getCourses(filters = {}) {
    let courses = Array.from(this.courses.values())
      .filter(c => c.status === 'published');

    if (filters.category) courses = courses.filter(c => c.category === filters.category);
    if (filters.level) courses = courses.filter(c => c.level === filters.level);
    if (filters.nation) courses = courses.filter(c => c.cultural.nation === filters.nation);
    if (filters.instructor) courses = courses.filter(c => c.instructor === filters.instructor);

    return courses.map(c => ({
      courseId: c.courseId,
      title: c.title,
      subtitle: c.subtitle,
      category: c.category,
      level: c.level,
      price: c.pricing.basePrice,
      currency: c.pricing.currency,
      thumbnail: c.content.modules[0]?.thumbnail,
      instructor: c.instructor,
      duration: c.content.totalDuration,
      lessons: c.content.totalLessons,
      rating: c.stats.rating,
      enrollments: c.stats.enrollments
    }));
  }

  generateId(prefix) {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  }
}

module.exports = new CoursesService();
