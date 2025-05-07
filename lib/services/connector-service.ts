// Connector Service
// This service acts as a bridge between different portals (admin, student, faculty)
// It handles data synchronization to ensure changes reflect across all relevant sections

// Storage keys for different data types
const STORAGE_KEYS = {
  TICKETS: 'shastri_tickets',
  STUDENTS: 'shastri_students',
  FACULTY: 'shastri_faculty',
  COURSES: 'shastri_courses',
  BATCHES: 'shastri_batches',
  DEPARTMENTS: 'shastri_departments',
  SCHEDULES: 'shastri_schedules'
};

// Event bus for notifying components about data changes
type DataChangeListener = (dataType: string, data: any) => void;
const listeners: DataChangeListener[] = [];

// Base data interfaces
interface Ticket {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  createdAt: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  assignedTo?: string;
  portalType: 'student' | 'faculty' | 'admin';
  priority: 'low' | 'medium' | 'high';
  category: string;
  responses: TicketResponse[];
}

interface TicketResponse {
  id: string;
  content: string;
  responderName: string;
  responderId: string;
  responderRole: 'student' | 'faculty' | 'admin';
  timestamp: string;
}

interface Department {
  id: string;
  code: string;
  name: string;
  description: string;
  headName: string;
  headId: string;
  establishedYear: number;
  facultyCount: number;
  studentCount: number;
  courses: number;
  batches: number;
}

interface Faculty {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  department: string;
  designation: string;
  specialization: string;
  qualifications: string[];
  joinDate: string;
  assignedBatches: {
    batchId: string;
    batchName: string;
    section: string;
  }[];
  assignedCourses: {
    courseId: string;
    courseName: string;
    semester: number;
  }[];
  status: "active" | "on leave" | "sabbatical" | "retired";
}

interface Student {
  id: string;
  enrollmentNo: string;
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  section: string;
  batch: string;
  department: string;
  academicDetails: {
    currentSemester: number;
    cgpa: number;
    attendance: number;
  };
  status: "active" | "inactive" | "alumni";
}

interface Course {
  id: string;
  code: string;
  name: string;
  description: string;
  credits: number;
  department: string;
  semester: number;
  facultyId: string;
  facultyName: string;
  syllabus?: string[];
  status: 'active' | 'inactive';
}

interface Batch {
  id: string;
  name: string;
  startYear: number;
  endYear: number;
  department: string;
  sections: string[];
  courseIds: string[];
  studentCount: number;
  status: 'active' | 'inactive' | 'completed';
}

interface Schedule {
  id: string;
  facultyId: string;
  facultyName: string;
  day: string;
  startTime: string;
  endTime: string;
  courseId: string;
  courseName: string;
  batchName: string;
  section: string;
  roomNumber: string;
  type: string;
}

// Helper function to safely interact with localStorage
const safeStorage = {
  get: (key: string): any => {
    if (typeof window === 'undefined') return null;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error retrieving ${key} from localStorage:`, error);
      return null;
    }
  },
  set: (key: string, value: any): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  }
};

// Notify all listeners about data changes
const notifyDataChange = (dataType: string, data: any) => {
  listeners.forEach(listener => listener(dataType, data));
};

// Main connector service functions
const ConnectorService = {
  // Register listener for data changes
  addChangeListener: (listener: DataChangeListener) => {
    listeners.push(listener);
    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  },

  // Tickets management
  tickets: {
    getAll: (): Ticket[] => {
      return safeStorage.get(STORAGE_KEYS.TICKETS) || [];
    },
    
    getByUser: (userId: string, userType: 'student' | 'faculty' | 'admin'): Ticket[] => {
      const tickets = ConnectorService.tickets.getAll();
      return tickets.filter(ticket => 
        ticket.createdBy === userId || 
        ticket.assignedTo === userId ||
        (userType === 'admin') // Admins can see all tickets
      );
    },
    
    getById: (ticketId: string): Ticket | null => {
      const tickets = ConnectorService.tickets.getAll();
      return tickets.find(ticket => ticket.id === ticketId) || null;
    },
    
    create: (ticket: Ticket): void => {
      const tickets = ConnectorService.tickets.getAll();
      tickets.push(ticket);
      safeStorage.set(STORAGE_KEYS.TICKETS, tickets);
      notifyDataChange('tickets', tickets);
    },
    
    update: (updatedTicket: Ticket): void => {
      const tickets = ConnectorService.tickets.getAll();
      const index = tickets.findIndex(ticket => ticket.id === updatedTicket.id);
      
      if (index !== -1) {
        tickets[index] = updatedTicket;
        safeStorage.set(STORAGE_KEYS.TICKETS, tickets);
        notifyDataChange('tickets', tickets);
      }
    },
    
    addResponse: (ticketId: string, response: TicketResponse): void => {
      const tickets = ConnectorService.tickets.getAll();
      const ticketIndex = tickets.findIndex(ticket => ticket.id === ticketId);
      
      if (ticketIndex !== -1) {
        tickets[ticketIndex].responses.push(response);
        safeStorage.set(STORAGE_KEYS.TICKETS, tickets);
        notifyDataChange('tickets', tickets);
      }
    },
    
    updateStatus: (ticketId: string, status: 'open' | 'in-progress' | 'resolved' | 'closed'): void => {
      const tickets = ConnectorService.tickets.getAll();
      const ticketIndex = tickets.findIndex(ticket => ticket.id === ticketId);
      
      if (ticketIndex !== -1) {
        tickets[ticketIndex].status = status;
        safeStorage.set(STORAGE_KEYS.TICKETS, tickets);
        notifyDataChange('tickets', tickets);
      }
    },
    
    delete: (ticketId: string): void => {
      let tickets = ConnectorService.tickets.getAll();
      tickets = tickets.filter(ticket => ticket.id !== ticketId);
      safeStorage.set(STORAGE_KEYS.TICKETS, tickets);
      notifyDataChange('tickets', tickets);
    }
  },
  
  // Department management
  departments: {
    getAll: (): Department[] => {
      return safeStorage.get(STORAGE_KEYS.DEPARTMENTS) || [];
    },
    
    getById: (deptId: string): Department | null => {
      const departments = ConnectorService.departments.getAll();
      return departments.find((dept: Department) => dept.id === deptId) || null;
    },
    
    create: (department: Department): void => {
      const departments = ConnectorService.departments.getAll();
      departments.push(department);
      safeStorage.set(STORAGE_KEYS.DEPARTMENTS, departments);
      notifyDataChange('departments', departments);
    },
    
    update: (updatedDepartment: Department): void => {
      const departments = ConnectorService.departments.getAll();
      const index = departments.findIndex((dept: Department) => dept.id === updatedDepartment.id);
      
      if (index !== -1) {
        departments[index] = updatedDepartment;
        safeStorage.set(STORAGE_KEYS.DEPARTMENTS, departments);
        notifyDataChange('departments', departments);
      }
    },
    
    delete: (deptId: string): void => {
      let departments = ConnectorService.departments.getAll();
      departments = departments.filter((dept: Department) => dept.id !== deptId);
      safeStorage.set(STORAGE_KEYS.DEPARTMENTS, departments);
      notifyDataChange('departments', departments);
    }
  },
  
  // Faculty management
  faculty: {
    getAll: (): Faculty[] => {
      return safeStorage.get(STORAGE_KEYS.FACULTY) || [];
    },
    
    getById: (facultyId: string): Faculty | null => {
      const facultyList = ConnectorService.faculty.getAll();
      return facultyList.find((f: Faculty) => f.id === facultyId) || null;
    },
    
    create: (faculty: Faculty): void => {
      const facultyList = ConnectorService.faculty.getAll();
      facultyList.push(faculty);
      safeStorage.set(STORAGE_KEYS.FACULTY, facultyList);
      notifyDataChange('faculty', facultyList);
    },
    
    update: (updatedFaculty: Faculty): void => {
      const facultyList = ConnectorService.faculty.getAll();
      const index = facultyList.findIndex((f: Faculty) => f.id === updatedFaculty.id);
      
      if (index !== -1) {
        facultyList[index] = updatedFaculty;
        safeStorage.set(STORAGE_KEYS.FACULTY, facultyList);
        notifyDataChange('faculty', facultyList);
      }
    },
    
    delete: (facultyId: string): void => {
      let facultyList = ConnectorService.faculty.getAll();
      facultyList = facultyList.filter((f: Faculty) => f.id !== facultyId);
      safeStorage.set(STORAGE_KEYS.FACULTY, facultyList);
      notifyDataChange('faculty', facultyList);
    }
  },
  
  // Student management
  students: {
    getAll: (): Student[] => {
      return safeStorage.get(STORAGE_KEYS.STUDENTS) || [];
    },
    
    getById: (studentId: string): Student | null => {
      const students = ConnectorService.students.getAll();
      return students.find((s: Student) => s.id === studentId) || null;
    },
    
    create: (student: Student): void => {
      const students = ConnectorService.students.getAll();
      students.push(student);
      safeStorage.set(STORAGE_KEYS.STUDENTS, students);
      notifyDataChange('students', students);
    },
    
    update: (updatedStudent: Student): void => {
      const students = ConnectorService.students.getAll();
      const index = students.findIndex((s: Student) => s.id === updatedStudent.id);
      
      if (index !== -1) {
        students[index] = updatedStudent;
        safeStorage.set(STORAGE_KEYS.STUDENTS, students);
        notifyDataChange('students', students);
      }
    },
    
    delete: (studentId: string): void => {
      let students = ConnectorService.students.getAll();
      students = students.filter((s: Student) => s.id !== studentId);
      safeStorage.set(STORAGE_KEYS.STUDENTS, students);
      notifyDataChange('students', students);
    }
  },
  
  // Courses management
  courses: {
    getAll: (): Course[] => {
      return safeStorage.get(STORAGE_KEYS.COURSES) || [];
    },
    
    getById: (courseId: string): Course | null => {
      const courses = ConnectorService.courses.getAll();
      return courses.find((c: Course) => c.id === courseId) || null;
    },
    
    create: (course: Course): void => {
      const courses = ConnectorService.courses.getAll();
      courses.push(course);
      safeStorage.set(STORAGE_KEYS.COURSES, courses);
      notifyDataChange('courses', courses);
    },
    
    update: (updatedCourse: Course): void => {
      const courses = ConnectorService.courses.getAll();
      const index = courses.findIndex((c: Course) => c.id === updatedCourse.id);
      
      if (index !== -1) {
        courses[index] = updatedCourse;
        safeStorage.set(STORAGE_KEYS.COURSES, courses);
        notifyDataChange('courses', courses);
      }
    },
    
    delete: (courseId: string): void => {
      let courses = ConnectorService.courses.getAll();
      courses = courses.filter((c: Course) => c.id !== courseId);
      safeStorage.set(STORAGE_KEYS.COURSES, courses);
      notifyDataChange('courses', courses);
    }
  },
  
  // Batches management
  batches: {
    getAll: (): Batch[] => {
      return safeStorage.get(STORAGE_KEYS.BATCHES) || [];
    },
    
    getById: (batchId: string): Batch | null => {
      const batches = ConnectorService.batches.getAll();
      return batches.find((b: Batch) => b.id === batchId) || null;
    },
    
    create: (batch: Batch): void => {
      const batches = ConnectorService.batches.getAll();
      batches.push(batch);
      safeStorage.set(STORAGE_KEYS.BATCHES, batches);
      notifyDataChange('batches', batches);
    },
    
    update: (updatedBatch: Batch): void => {
      const batches = ConnectorService.batches.getAll();
      const index = batches.findIndex((b: Batch) => b.id === updatedBatch.id);
      
      if (index !== -1) {
        batches[index] = updatedBatch;
        safeStorage.set(STORAGE_KEYS.BATCHES, batches);
        notifyDataChange('batches', batches);
      }
    },
    
    delete: (batchId: string): void => {
      let batches = ConnectorService.batches.getAll();
      batches = batches.filter((b: Batch) => b.id !== batchId);
      safeStorage.set(STORAGE_KEYS.BATCHES, batches);
      notifyDataChange('batches', batches);
    }
  },
  
  // Faculty schedules
  schedules: {
    getAll: (): Schedule[] => {
      return safeStorage.get(STORAGE_KEYS.SCHEDULES) || [];
    },
    
    getByFaculty: (facultyId: string): Schedule[] => {
      const schedules = ConnectorService.schedules.getAll();
      return schedules.filter((s: Schedule) => s.facultyId === facultyId);
    },
    
    create: (schedule: Schedule): void => {
      const schedules = ConnectorService.schedules.getAll();
      schedules.push(schedule);
      safeStorage.set(STORAGE_KEYS.SCHEDULES, schedules);
      notifyDataChange('schedules', schedules);
    },
    
    update: (updatedSchedule: Schedule): void => {
      const schedules = ConnectorService.schedules.getAll();
      const index = schedules.findIndex((s: Schedule) => s.id === updatedSchedule.id);
      
      if (index !== -1) {
        schedules[index] = updatedSchedule;
        safeStorage.set(STORAGE_KEYS.SCHEDULES, schedules);
        notifyDataChange('schedules', schedules);
      }
    },
    
    delete: (scheduleId: string): void => {
      let schedules = ConnectorService.schedules.getAll();
      schedules = schedules.filter((s: Schedule) => s.id !== scheduleId);
      safeStorage.set(STORAGE_KEYS.SCHEDULES, schedules);
      notifyDataChange('schedules', schedules);
    }
  },
  
  // Initialization functions
  initializeIfEmpty: () => {
    // This function checks if data exists and initializes with mock data if needed
    if (!safeStorage.get(STORAGE_KEYS.TICKETS)) {
      safeStorage.set(STORAGE_KEYS.TICKETS, []);
    }
    
    if (!safeStorage.get(STORAGE_KEYS.DEPARTMENTS)) {
      safeStorage.set(STORAGE_KEYS.DEPARTMENTS, []);
    }
    
    if (!safeStorage.get(STORAGE_KEYS.FACULTY)) {
      safeStorage.set(STORAGE_KEYS.FACULTY, []);
    }
    
    if (!safeStorage.get(STORAGE_KEYS.STUDENTS)) {
      safeStorage.set(STORAGE_KEYS.STUDENTS, []);
    }
    
    if (!safeStorage.get(STORAGE_KEYS.COURSES)) {
      safeStorage.set(STORAGE_KEYS.COURSES, []);
    }
    
    if (!safeStorage.get(STORAGE_KEYS.BATCHES)) {
      safeStorage.set(STORAGE_KEYS.BATCHES, []);
    }
    
    if (!safeStorage.get(STORAGE_KEYS.SCHEDULES)) {
      safeStorage.set(STORAGE_KEYS.SCHEDULES, []);
    }
  }
};

export default ConnectorService; 