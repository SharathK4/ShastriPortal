import { 
  getFacultyAssignments, 
  FacultyAssignment,
} from "./faculty-storage";

import {
  getAssignments,
  saveAssignments,
  addNotification,
  Assignment,
} from "./student-storage";

/**
 * Convert a faculty assignment to a student assignment
 */
export const convertToStudentAssignment = (facultyAssignment: FacultyAssignment): Assignment => {
  return {
    id: facultyAssignment.id,
    title: facultyAssignment.title,
    courseId: facultyAssignment.courseId,
    courseName: facultyAssignment.courseName,
    dueDate: facultyAssignment.dueDate,
    status: 'pending',
    maxScore: facultyAssignment.maxScore,
    isGroupAssignment: facultyAssignment.isGroupAssignment,
    content: facultyAssignment.description, // Store faculty description as student content
    attachments: facultyAssignment.attachments,
  };
};

/**
 * Get faculty assignments that aren't already in student assignments
 */
export const getNewFacultyAssignments = (): FacultyAssignment[] => {
  const facultyAssignments = getFacultyAssignments();
  const studentAssignments = getAssignments();
  
  // Get faculty assignments that aren't in student assignments
  return facultyAssignments.filter(
    facultyAssignment => !studentAssignments.some(
      studentAssignment => studentAssignment.id === facultyAssignment.id
    )
  );
};

/**
 * Sync faculty assignments to student assignments
 */
export const syncAssignments = (): void => {
  // Get new faculty assignments
  const newFacultyAssignments = getNewFacultyAssignments();
  
  if (newFacultyAssignments.length === 0) {
    return;
  }
  
  // Get existing student assignments
  const studentAssignments = getAssignments();
  
  // Convert faculty assignments to student assignments
  const newStudentAssignments = newFacultyAssignments.map(
    facultyAssignment => convertToStudentAssignment(facultyAssignment)
  );
  
  // Add new student assignments
  const updatedStudentAssignments = [...studentAssignments, ...newStudentAssignments];
  
  // Save updated student assignments
  saveAssignments(updatedStudentAssignments);
  
  // Create notifications for new assignments
  newStudentAssignments.forEach(assignment => {
    addNotification({
      id: `new-assignment-${assignment.id}`,
      title: "New Assignment",
      message: `A new assignment "${assignment.title}" has been posted for ${assignment.courseName}`,
      createdAt: new Date().toISOString(),
      isRead: false,
      type: 'assignment',
    });
  });
};

/**
 * Auto-sync faculty assignments to student assignments
 * This can be called at regular intervals or on specific events
 */
export const autoSyncAssignments = (): void => {
  // Only run in browser environment
  if (typeof window !== 'undefined') {
    syncAssignments();
  }
}; 