/**
 * Utility for faculty-specific data storage
 */

import { STORAGE_KEYS } from "./localStorage";

// Types for faculty data storage
export interface FacultyCourse {
  id: string;
  code: string;
  name: string;
  department: string;
  credits: number;
  batchYear: string;
  studentCount: number;
  schedule: string[];
}

export interface FacultyAssignment {
  id: string;
  title: string;
  courseId: string;
  courseName: string;
  description: string;
  dueDate: string;
  maxScore: number;
  isGroupAssignment: boolean;
  maxGroupSize?: number;
  attachments?: string[];
  createdAt: string;
}

export interface StudentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  submissionDate: string;
  status: 'submitted' | 'graded';
  score?: number;
  feedback?: string;
  attachments?: string[];
  isGroupSubmission: boolean;
  groupMembers?: Array<{id: string, name: string}>;
}

export interface FacultyTicket {
  id: string;
  title: string;
  description: string;
  studentId: string;
  studentName: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
  response?: string;
}

export interface FacultyNotification {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  type: 'assignment' | 'submission' | 'ticket' | 'announcement';
}

export interface FacultyProfile {
  facultyId: string;
  name: string;
  email: string;
  department: string;
  title: string;
  joinedDate: string;
  phoneNumber?: string;
  office?: string;
  officeHours?: string[];
  bio?: string;
  profilePicture?: string;
}

// Storage keys for faculty data
export const FACULTY_STORAGE_KEYS = {
  COURSES: 'shastri_faculty_courses',
  ASSIGNMENTS: 'shastri_faculty_assignments',
  SUBMISSIONS: 'shastri_faculty_submissions',
  TICKETS: 'shastri_faculty_tickets',
  NOTIFICATIONS: 'shastri_faculty_notifications',
  PROFILE: 'shastri_faculty_profile',
}

// Courses functions
export const getFacultyCourses = (): FacultyCourse[] => {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(FACULTY_STORAGE_KEYS.COURSES);
    return data ? JSON.parse(data) : [];
  }
  return [];
};

export const saveFacultyCourses = (courses: FacultyCourse[]): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(FACULTY_STORAGE_KEYS.COURSES, JSON.stringify(courses));
  }
};

export const addFacultyCourse = (course: FacultyCourse): FacultyCourse[] => {
  const courses = getFacultyCourses();
  // Check if course already exists
  if (!courses.some(c => c.id === course.id)) {
    const updatedCourses = [...courses, course];
    saveFacultyCourses(updatedCourses);
    return updatedCourses;
  }
  return courses;
};

export const updateFacultyCourse = (updatedCourse: FacultyCourse): FacultyCourse[] => {
  const courses = getFacultyCourses();
  const updatedCourses = courses.map(course => 
    course.id === updatedCourse.id ? updatedCourse : course
  );
  saveFacultyCourses(updatedCourses);
  return updatedCourses;
};

export const deleteFacultyCourse = (courseId: string): FacultyCourse[] => {
  const courses = getFacultyCourses();
  const updatedCourses = courses.filter(course => course.id !== courseId);
  saveFacultyCourses(updatedCourses);
  return updatedCourses;
};

// Assignments functions
export const getFacultyAssignments = (): FacultyAssignment[] => {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(FACULTY_STORAGE_KEYS.ASSIGNMENTS);
    return data ? JSON.parse(data) : [];
  }
  return [];
};

export const saveFacultyAssignments = (assignments: FacultyAssignment[]): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(FACULTY_STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(assignments));
  }
};

export const createAssignment = (assignment: FacultyAssignment): FacultyAssignment[] => {
  const assignments = getFacultyAssignments();
  const updatedAssignments = [...assignments, assignment];
  saveFacultyAssignments(updatedAssignments);
  return updatedAssignments;
};

export const updateAssignment = (updatedAssignment: FacultyAssignment): FacultyAssignment[] => {
  const assignments = getFacultyAssignments();
  const updatedAssignments = assignments.map(assignment => 
    assignment.id === updatedAssignment.id ? updatedAssignment : assignment
  );
  saveFacultyAssignments(updatedAssignments);
  return updatedAssignments;
};

export const deleteAssignment = (assignmentId: string): FacultyAssignment[] => {
  const assignments = getFacultyAssignments();
  const updatedAssignments = assignments.filter(assignment => assignment.id !== assignmentId);
  saveFacultyAssignments(updatedAssignments);
  return updatedAssignments;
};

// Submissions functions
export const getStudentSubmissions = (): StudentSubmission[] => {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(FACULTY_STORAGE_KEYS.SUBMISSIONS);
    return data ? JSON.parse(data) : [];
  }
  return [];
};

export const saveStudentSubmissions = (submissions: StudentSubmission[]): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(FACULTY_STORAGE_KEYS.SUBMISSIONS, JSON.stringify(submissions));
  }
};

export const gradeSubmission = (submissionId: string, score: number, feedback: string): StudentSubmission[] => {
  const submissions = getStudentSubmissions();
  const updatedSubmissions = submissions.map(submission => 
    submission.id === submissionId 
      ? { ...submission, status: 'graded' as const, score, feedback } 
      : submission
  );
  saveStudentSubmissions(updatedSubmissions);
  return updatedSubmissions;
};

export const getSubmissionsByAssignment = (assignmentId: string): StudentSubmission[] => {
  const submissions = getStudentSubmissions();
  return submissions.filter(submission => submission.assignmentId === assignmentId);
};

// Tickets functions
export const getFacultyTickets = (): FacultyTicket[] => {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(FACULTY_STORAGE_KEYS.TICKETS);
    return data ? JSON.parse(data) : [];
  }
  return [];
};

export const saveFacultyTickets = (tickets: FacultyTicket[]): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(FACULTY_STORAGE_KEYS.TICKETS, JSON.stringify(tickets));
  }
};

export const updateTicketStatus = (ticketId: string, status: FacultyTicket['status'], response?: string): FacultyTicket[] => {
  const tickets = getFacultyTickets();
  const updatedTickets = tickets.map(ticket => 
    ticket.id === ticketId 
      ? { 
          ...ticket, 
          status, 
          updatedAt: new Date().toISOString(),
          response: response || ticket.response 
        } 
      : ticket
  );
  saveFacultyTickets(updatedTickets);
  return updatedTickets;
};

export const addFacultyTicket = (ticket: Omit<FacultyTicket, 'id' | 'createdAt' | 'updatedAt'>): FacultyTicket[] => {
  const tickets = getFacultyTickets();
  const newTicket: FacultyTicket = {
    ...ticket,
    id: `TCKT${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const updatedTickets = [newTicket, ...tickets];
  saveFacultyTickets(updatedTickets);
  return updatedTickets;
};

// Notification functions
export const getFacultyNotifications = (): FacultyNotification[] => {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(FACULTY_STORAGE_KEYS.NOTIFICATIONS);
    return data ? JSON.parse(data) : [];
  }
  return [];
};

export const saveFacultyNotifications = (notifications: FacultyNotification[]): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(FACULTY_STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }
};

export const addFacultyNotification = (notification: FacultyNotification): FacultyNotification[] => {
  const notifications = getFacultyNotifications();
  const updatedNotifications = [notification, ...notifications]; // Add to beginning of array
  saveFacultyNotifications(updatedNotifications);
  return updatedNotifications;
};

export const markFacultyNotificationAsRead = (notificationId: string): FacultyNotification[] => {
  const notifications = getFacultyNotifications();
  const updatedNotifications = notifications.map(notification => 
    notification.id === notificationId 
      ? { ...notification, isRead: true } 
      : notification
  );
  saveFacultyNotifications(updatedNotifications);
  return updatedNotifications;
};

export const markAllFacultyNotificationsAsRead = (): FacultyNotification[] => {
  const notifications = getFacultyNotifications();
  const updatedNotifications = notifications.map(notification => ({ ...notification, isRead: true }));
  saveFacultyNotifications(updatedNotifications);
  return updatedNotifications;
};

// Profile functions
export const getFacultyProfile = (): FacultyProfile | null => {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(FACULTY_STORAGE_KEYS.PROFILE);
    return data ? JSON.parse(data) : null;
  }
  return null;
};

export const saveFacultyProfile = (profile: FacultyProfile): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(FACULTY_STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  }
};

export const updateFacultyProfile = (updatedProfile: Partial<FacultyProfile>): FacultyProfile | null => {
  const profile = getFacultyProfile();
  if (!profile) return null;
  
  const newProfile = { ...profile, ...updatedProfile };
  saveFacultyProfile(newProfile);
  return newProfile;
};

// Initialization of demo data 
export const initializeFacultyData = (facultyId: string, name: string, email: string): void => {
  // Only initialize if data doesn't exist
  if (getFacultyCourses().length === 0) {
    // Initialize with some demo courses
    const demoCourses: FacultyCourse[] = [
      {
        id: "1",
        code: "CSE101",
        name: "Introduction to Computer Science",
        department: "Computer Science",
        credits: 4,
        batchYear: "2023",
        studentCount: 45,
        schedule: ["Monday 9:00-10:30", "Wednesday 9:00-10:30"],
      },
      {
        id: "2",
        code: "CSE201",
        name: "Data Structures",
        department: "Computer Science",
        credits: 3,
        batchYear: "2022",
        studentCount: 38,
        schedule: ["Tuesday 11:00-12:30", "Thursday 11:00-12:30"],
      },
      {
        id: "3",
        code: "CSE301",
        name: "Database Management Systems",
        department: "Computer Science",
        credits: 4,
        batchYear: "2023",
        studentCount: 40,
        schedule: ["Monday 2:00-3:30", "Friday 2:00-3:30"],
      },
    ];
    saveFacultyCourses(demoCourses);

    // Initialize with some demo assignments
    const demoAssignments: FacultyAssignment[] = [
      {
        id: "1",
        title: "Introduction to Programming Assignment",
        courseId: "1",
        courseName: "Introduction to Computer Science",
        description: "Write a simple program that demonstrates basic programming concepts",
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
        maxScore: 100,
        isGroupAssignment: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        title: "Data Structures Project",
        courseId: "2",
        courseName: "Data Structures",
        description: "Implement a balanced binary search tree and analyze its performance",
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks from now
        maxScore: 100,
        isGroupAssignment: true,
        maxGroupSize: 4,
        createdAt: new Date().toISOString(),
      },
      {
        id: "3",
        title: "SQL Assignment",
        courseId: "3",
        courseName: "Database Management Systems",
        description: "Design a normalized database schema for a student management system",
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
        maxScore: 50,
        isGroupAssignment: false,
        createdAt: new Date().toISOString(),
      },
    ];
    saveFacultyAssignments(demoAssignments);

    // Initialize with some demo submissions
    const demoSubmissions: StudentSubmission[] = [
      {
        id: "1",
        assignmentId: "1",
        studentId: "STU1001",
        studentName: "Rahul Singh",
        submissionDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'submitted',
        isGroupSubmission: false,
      },
      {
        id: "2",
        assignmentId: "1",
        studentId: "STU1002",
        studentName: "Priya Sharma",
        submissionDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'graded',
        score: 85,
        feedback: "Good work, but could improve on code readability.",
        isGroupSubmission: false,
      },
      {
        id: "3",
        assignmentId: "2",
        studentId: "STU1003",
        studentName: "Amit Kumar",
        submissionDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'submitted',
        isGroupSubmission: true,
        groupMembers: [
          { id: "STU1003", name: "Amit Kumar" },
          { id: "STU1004", name: "Sneha Patel" },
          { id: "STU1005", name: "Vikram Desai" },
        ],
      },
    ];
    saveStudentSubmissions(demoSubmissions);

    // Initialize with demo tickets
    const demoTickets: FacultyTicket[] = [
      {
        id: "1",
        title: "Question about assignment deadline",
        description: "I'm confused about when the SQL assignment is due. Can you clarify?",
        studentId: "STU1001",
        studentName: "Rahul Singh",
        status: 'open',
        priority: 'medium',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "2",
        title: "Request for re-evaluation",
        description: "I believe there was an error in grading my assignment. Could you please review it again?",
        studentId: "STU1002",
        studentName: "Priya Sharma",
        status: 'in-progress',
        priority: 'high',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        response: "I've started reviewing your assignment and will provide feedback soon.",
      },
    ];
    saveFacultyTickets(demoTickets);

    // Initialize with demo notifications
    const demoNotifications: FacultyNotification[] = [
      {
        id: "1",
        title: "New Assignment Submission",
        message: "Rahul Singh has submitted Introduction to Programming Assignment",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        isRead: false,
        type: 'submission',
      },
      {
        id: "2",
        title: "New Support Ticket",
        message: "Priya Sharma has raised a ticket: Request for re-evaluation",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        isRead: true,
        type: 'ticket',
      },
    ];
    saveFacultyNotifications(demoNotifications);

    // Initialize profile
    const demoProfile: FacultyProfile = {
      facultyId,
      name,
      email,
      department: "Computer Science",
      title: "Associate Professor",
      joinedDate: new Date(2020, 6, 1).toISOString(), // July 1, 2020
      office: "CS Building, Room 301",
      officeHours: ["Monday 1:00-3:00 PM", "Thursday 2:00-4:00 PM"],
    };
    saveFacultyProfile(demoProfile);
  }
}; 