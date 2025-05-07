/**
 * A utility for handling local storage operations
 */

// Type for user data
export interface UserData {
  id?: string;
  name: string;
  email: string;
  userType: 'student' | 'faculty' | 'admin';
  token?: string;
  studentId?: string;
  facultyId?: string;
}

// Type for user preferences
export interface UserPreferences {
  theme?: 'light' | 'dark';
  viewMode?: 'week' | 'month';
  notifications?: boolean;
}

// Keys for localStorage items
export const STORAGE_KEYS = {
  USER_DATA: 'shastri_user_data',
  USER_PREFERENCES: 'shastri_user_preferences',
}

/**
 * Save user data to localStorage
 */
export const saveUserData = (userData: UserData): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
  }
};

/**
 * Get user data from localStorage
 */
export const getUserData = (): UserData | null => {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    return data ? JSON.parse(data) : null;
  }
  return null;
};

/**
 * Clear user data from localStorage
 */
export const clearUserData = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
  }
};

/**
 * Save user preferences to localStorage
 */
export const saveUserPreferences = (preferences: UserPreferences): void => {
  if (typeof window !== 'undefined') {
    // Get existing preferences first
    const existingPrefs = getUserPreferences();
    // Merge with new preferences
    const updatedPrefs = { ...existingPrefs, ...preferences };
    localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(updatedPrefs));
  }
};

/**
 * Get user preferences from localStorage
 */
export const getUserPreferences = (): UserPreferences => {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
    return data ? JSON.parse(data) : {};
  }
  return {};
};

/**
 * Clear all storage data
 */
export const clearAllStorageData = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    localStorage.removeItem(STORAGE_KEYS.USER_PREFERENCES);
  }
}; 