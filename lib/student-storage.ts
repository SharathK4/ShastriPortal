/**
 * Utility for student-specific data storage
 */

import { STORAGE_KEYS } from "./localStorage";

// Types for student data storage
export interface Course {
  id: string;
  code: string;
  name: string;
  instructor: string;
  credits: number;
  batch: string;
}

export interface Assignment {
  id: string;
  title: string;
  courseId: string;
  courseName: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded';
  score?: number;
  maxScore: number;
  isGroupAssignment?: boolean;
  content?: string;
  attachments?: string[];
}

export interface Grade {
  courseId: string;
  courseName: string;
  score: number;
  maxScore: number;
  grade: string;
  semester: string;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  createdAt: string;
  updatedAt: string;
  priority: 'low' | 'medium' | 'high';
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  type: 'assignment' | 'grade' | 'course' | 'announcement' | 'ticket';
}

export interface StudentProfile {
  studentId: string;
  name: string;
  email: string;
  department: string;
  batch: string;
  joinedDate: string;
  phoneNumber?: string;
  address?: string;
  profilePicture?: string;
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  content?: string;
  attachments?: string[];
  submissionDate: string;
  isGroupSubmission: boolean;
  groupMembers?: Array<{id: string, name: string}>;
}

// Storage keys for student data
export const STUDENT_STORAGE_KEYS = {
  ENROLLED_COURSES: 'shastri_enrolled_courses',
  ASSIGNMENTS: 'shastri_assignments',
  GRADES: 'shastri_grades',
  TICKETS: 'shastri_tickets',
  NOTIFICATIONS: 'shastri_notifications',
  PROFILE: 'shastri_student_profile',
  SUBMISSIONS: 'shastri_student_submissions',
}

// Courses functions
export const getEnrolledCourses = (): Course[] => {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(STUDENT_STORAGE_KEYS.ENROLLED_COURSES);
    return data ? JSON.parse(data) : [];
  }
  return [];
};

export const saveEnrolledCourses = (courses: Course[]): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STUDENT_STORAGE_KEYS.ENROLLED_COURSES, JSON.stringify(courses));
  }
};

export const enrollCourse = (course: Course): Course[] => {
  const courses = getEnrolledCourses();
  // Check if course already exists
  if (!courses.some(c => c.id === course.id)) {
    const updatedCourses = [...courses, course];
    saveEnrolledCourses(updatedCourses);
    return updatedCourses;
  }
  return courses;
};

export const unenrollCourse = (courseId: string): Course[] => {
  const courses = getEnrolledCourses();
  const updatedCourses = courses.filter(course => course.id !== courseId);
  saveEnrolledCourses(updatedCourses);
  return updatedCourses;
};

// Assignment functions
export const getAssignments = (): Assignment[] => {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(STUDENT_STORAGE_KEYS.ASSIGNMENTS);
    return data ? JSON.parse(data) : [];
  }
  return [];
};

export const saveAssignments = (assignments: Assignment[]): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STUDENT_STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(assignments));
  }
};

export const addAssignment = (assignment: Assignment): Assignment[] => {
  const assignments = getAssignments();
  const updatedAssignments = [...assignments, assignment];
  saveAssignments(updatedAssignments);
  return updatedAssignments;
};

export const updateAssignment = (updatedAssignment: Assignment): Assignment[] => {
  const assignments = getAssignments();
  const updatedAssignments = assignments.map(assignment => 
    assignment.id === updatedAssignment.id ? updatedAssignment : assignment
  );
  saveAssignments(updatedAssignments);
  return updatedAssignments;
};

export const deleteAssignment = (assignmentId: string): Assignment[] => {
  const assignments = getAssignments();
  const updatedAssignments = assignments.filter(assignment => assignment.id !== assignmentId);
  saveAssignments(updatedAssignments);
  return updatedAssignments;
};

// Submission functions
export const getSubmissions = (): Submission[] => {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(STUDENT_STORAGE_KEYS.SUBMISSIONS);
    return data ? JSON.parse(data) : [];
  }
  return [];
};

export const saveSubmissions = (submissions: Submission[]): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STUDENT_STORAGE_KEYS.SUBMISSIONS, JSON.stringify(submissions));
  }
};

export const addSubmission = (submission: Submission): Submission[] => {
  const submissions = getSubmissions();
  const updatedSubmissions = [...submissions, submission];
  saveSubmissions(updatedSubmissions);
  
  // Update assignment status to submitted
  const assignment = getAssignments().find(a => a.id === submission.assignmentId);
  if (assignment) {
    updateAssignment({
      ...assignment,
      status: 'submitted'
    });
  }
  
  return updatedSubmissions;
};

export const getSubmissionByAssignment = (assignmentId: string): Submission | undefined => {
  const submissions = getSubmissions();
  return submissions.find(submission => submission.assignmentId === assignmentId);
};

// Grade functions
export const getGrades = (): Grade[] => {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(STUDENT_STORAGE_KEYS.GRADES);
    return data ? JSON.parse(data) : [];
  }
  return [];
};

export const saveGrades = (grades: Grade[]): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STUDENT_STORAGE_KEYS.GRADES, JSON.stringify(grades));
  }
};

export const addGrade = (grade: Grade): Grade[] => {
  const grades = getGrades();
  const updatedGrades = [...grades, grade];
  saveGrades(updatedGrades);
  return updatedGrades;
};

export const updateGrade = (updatedGrade: Grade): Grade[] => {
  const grades = getGrades();
  // Find if grade exists for this course and semester
  const gradeExists = grades.some(g => 
    g.courseId === updatedGrade.courseId && g.semester === updatedGrade.semester
  );
  
  let updatedGrades;
  if (gradeExists) {
    updatedGrades = grades.map(grade => 
      (grade.courseId === updatedGrade.courseId && grade.semester === updatedGrade.semester) 
        ? updatedGrade 
        : grade
    );
  } else {
    updatedGrades = [...grades, updatedGrade];
  }
  
  saveGrades(updatedGrades);
  return updatedGrades;
};

// Ticket functions
export const getTickets = (): Ticket[] => {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(STUDENT_STORAGE_KEYS.TICKETS);
    return data ? JSON.parse(data) : [];
  }
  return [];
};

export const saveTickets = (tickets: Ticket[]): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STUDENT_STORAGE_KEYS.TICKETS, JSON.stringify(tickets));
  }
};

export const createTicket = (ticket: Ticket): Ticket[] => {
  const tickets = getTickets();
  const updatedTickets = [...tickets, ticket];
  saveTickets(updatedTickets);
  return updatedTickets;
};

export const updateTicket = (updatedTicket: Ticket): Ticket[] => {
  const tickets = getTickets();
  const updatedTickets = tickets.map(ticket => 
    ticket.id === updatedTicket.id ? updatedTicket : ticket
  );
  saveTickets(updatedTickets);
  return updatedTickets;
};

// Notification functions
export const getNotifications = (): Notification[] => {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(STUDENT_STORAGE_KEYS.NOTIFICATIONS);
    return data ? JSON.parse(data) : [];
  }
  return [];
};

export const saveNotifications = (notifications: Notification[]): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STUDENT_STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }
};

export const addNotification = (notification: Notification): Notification[] => {
  const notifications = getNotifications();
  const updatedNotifications = [notification, ...notifications]; // Add to beginning of array
  saveNotifications(updatedNotifications);
  return updatedNotifications;
};

export const markNotificationAsRead = (notificationId: string): Notification[] => {
  const notifications = getNotifications();
  const updatedNotifications = notifications.map(notification => 
    notification.id === notificationId 
      ? { ...notification, isRead: true } 
      : notification
  );
  saveNotifications(updatedNotifications);
  return updatedNotifications;
};

export const markAllNotificationsAsRead = (): Notification[] => {
  const notifications = getNotifications();
  const updatedNotifications = notifications.map(notification => ({ ...notification, isRead: true }));
  saveNotifications(updatedNotifications);
  return updatedNotifications;
};

export const deleteNotification = (notificationId: string): Notification[] => {
  const notifications = getNotifications();
  const updatedNotifications = notifications.filter(notification => notification.id !== notificationId);
  saveNotifications(updatedNotifications);
  return updatedNotifications;
};

// Profile functions
export const getStudentProfile = (): StudentProfile | null => {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(STUDENT_STORAGE_KEYS.PROFILE);
    return data ? JSON.parse(data) : null;
  }
  return null;
};

export const saveStudentProfile = (profile: StudentProfile): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STUDENT_STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  }
};

export const updateStudentProfile = (updatedProfile: Partial<StudentProfile>): StudentProfile | null => {
  const profile = getStudentProfile();
  if (!profile) return null;
  
  const newProfile = { ...profile, ...updatedProfile };
  saveStudentProfile(newProfile);
  return newProfile;
};

// Initialization of demo data 
export const initializeStudentData = (studentId: string, name: string, email: string): void => {
  // Only initialize if data doesn't exist
  if (getEnrolledCourses().length === 0) {
    // Initialize with some demo courses
    const demoCourses: Course[] = [
      {
        id: "1",
        code: "CSE101",
        name: "Introduction to Computer Science",
        instructor: "Dr. Sharma",
        credits: 4,
        batch: "2023",
      },
      {
        id: "2",
        code: "CSE201",
        name: "Data Structures",
        instructor: "Dr. Gupta",
        credits: 3,
        batch: "2023",
      },
      {
        id: "3",
        code: "CSE301",
        name: "Database Management Systems",
        instructor: "Dr. Singh",
        credits: 4,
        batch: "2023",
      },
    ];
    saveEnrolledCourses(demoCourses);

    // Initialize with some demo assignments
    const demoAssignments: Assignment[] = [
      {
        id: "1",
        title: "Introduction to Programming Assignment",
        courseId: "1",
        courseName: "Introduction to Computer Science",
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
        status: 'pending',
        maxScore: 100,
      },
      {
        id: "2",
        title: "Data Structures Project",
        courseId: "2",
        courseName: "Data Structures",
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks from now
        status: 'pending',
        maxScore: 100,
        isGroupAssignment: true,
      },
      {
        id: "3",
        title: "SQL Assignment",
        courseId: "3",
        courseName: "Database Management Systems",
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
        status: 'pending',
        maxScore: 50,
      },
    ];
    saveAssignments(demoAssignments);

    // Initialize with some demo grades
    const demoGrades: Grade[] = [
      {
        courseId: "1",
        courseName: "Introduction to Computer Science",
        score: 85,
        maxScore: 100,
        grade: "A",
        semester: "Fall 2023",
      },
      {
        courseId: "2",
        courseName: "Data Structures",
        score: 78,
        maxScore: 100,
        grade: "B+",
        semester: "Fall 2023",
      },
    ];
    saveGrades(demoGrades);

    // Initialize with demo notifications
    const demoNotifications: Notification[] = [
      {
        id: "1",
        title: "Assignment Due Soon",
        message: "SQL Assignment is due in 3 days",
        createdAt: new Date().toISOString(),
        isRead: false,
        type: 'assignment',
      },
      {
        id: "2",
        title: "New Grade Posted",
        message: "A new grade has been posted for Introduction to Computer Science",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        isRead: false,
        type: 'grade',
      },
    ];
    saveNotifications(demoNotifications);

    // Initialize profile
    const demoProfile: StudentProfile = {
      studentId,
      name,
      email,
      department: "Computer Science",
      batch: "2023",
      joinedDate: new Date(2023, 8, 1).toISOString(), // September 1, 2023
    };
    saveStudentProfile(demoProfile);
  }
}; 