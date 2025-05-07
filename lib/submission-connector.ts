import { 
  getStudentSubmissions,
  saveStudentSubmissions,
  addFacultyNotification,
  StudentSubmission
} from "./faculty-storage";

import {
  getSubmissions,
  Assignment,
  Submission
} from "./student-storage";

/**
 * Convert a student submission (from student side) to faculty-side student submission
 */
export const convertToFacultySubmission = (
  studentSubmission: Submission, 
  assignment: Assignment
): StudentSubmission => {
  return {
    id: studentSubmission.id,
    assignmentId: studentSubmission.assignmentId,
    studentId: studentSubmission.studentId,
    studentName: studentSubmission.studentName,
    submissionDate: studentSubmission.submissionDate,
    status: 'submitted',
    attachments: studentSubmission.attachments,
    isGroupSubmission: studentSubmission.isGroupSubmission,
    groupMembers: studentSubmission.groupMembers
  };
};

/**
 * Get student submissions that aren't already in faculty submissions
 */
export const getNewStudentSubmissions = (): { submission: Submission, assignment: Assignment }[] => {
  const facultySubmissions = getStudentSubmissions();
  const studentSubmissions = getSubmissions();
  
  if (studentSubmissions.length === 0) {
    return [];
  }
  
  // Get student submissions that aren't in faculty submissions
  const newSubmissions = studentSubmissions.filter(
    studentSubmission => !facultySubmissions.some(
      facultySubmission => facultySubmission.id === studentSubmission.id
    )
  );
  
  if (newSubmissions.length === 0) {
    return [];
  }
  
  // For each new submission, we need the assignment data
  return newSubmissions.map(submission => {
    // Find the assignment for this submission
    const assignments = submission.isGroupSubmission 
      ? [] // For group submissions, we don't need to find individual assignments
      : [{ id: submission.assignmentId } as Assignment]; // Just pass the ID
    
    return {
      submission,
      assignment: assignments[0] || { id: submission.assignmentId } as Assignment
    };
  });
};

/**
 * Sync student submissions to faculty submissions
 */
export const syncSubmissions = (): void => {
  // Get new student submissions
  const newSubmissionsWithAssignments = getNewStudentSubmissions();
  
  if (newSubmissionsWithAssignments.length === 0) {
    return;
  }
  
  // Get existing faculty submissions
  const facultySubmissions = getStudentSubmissions();
  
  // Convert student submissions to faculty submissions
  const newFacultySubmissions = newSubmissionsWithAssignments.map(
    ({ submission, assignment }) => convertToFacultySubmission(submission, assignment)
  );
  
  // Add new faculty submissions
  const updatedFacultySubmissions = [...facultySubmissions, ...newFacultySubmissions];
  
  // Save updated faculty submissions
  saveStudentSubmissions(updatedFacultySubmissions);
  
  // Create notifications for new submissions
  newFacultySubmissions.forEach(submission => {
    addFacultyNotification({
      id: `new-submission-${submission.id}`,
      title: "New Submission Received",
      message: `${submission.studentName} has submitted their assignment for grading.`,
      createdAt: new Date().toISOString(),
      isRead: false,
      type: 'submission'
    });
  });
};

/**
 * Auto-sync student submissions to faculty submissions
 * This can be called at regular intervals or on specific events
 */
export const autoSyncSubmissions = (): void => {
  // Only run in browser environment
  if (typeof window !== 'undefined') {
    syncSubmissions();
  }
}; 