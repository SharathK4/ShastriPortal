/**
 * Admin storage management functions
 * 
 * This module handles admin-specific data storage
 */

// Key prefixes for localStorage items
const ADMIN_STORAGE_PREFIX = 'shastri_admin';
const ADMIN_DATA_KEY = `${ADMIN_STORAGE_PREFIX}_data`;
const ADMIN_SETTINGS_KEY = `${ADMIN_STORAGE_PREFIX}_settings`;

// Interfaces for admin data
export interface AdminData {
  id: string;
  name: string;
  email: string;
}

export interface AdminSettings {
  dashboardLayout?: string;
  theme?: 'light' | 'dark';
  notificationsEnabled?: boolean;
}

/**
 * Initialize admin data in localStorage
 * @param adminId - Admin ID
 * @param name - Admin name
 * @param email - Admin email
 */
export const initializeAdminData = (adminId: string, name: string, email: string): void => {
  if (typeof window === 'undefined') return;
  
  // Store admin profile data
  const adminData: AdminData = {
    id: adminId,
    name,
    email,
  };
  
  localStorage.setItem(ADMIN_DATA_KEY, JSON.stringify(adminData));
  
  // Initialize settings with defaults
  const defaultSettings: AdminSettings = {
    dashboardLayout: 'default',
    theme: 'light',
    notificationsEnabled: true,
  };
  
  localStorage.setItem(ADMIN_SETTINGS_KEY, JSON.stringify(defaultSettings));
};

/**
 * Get admin data from localStorage
 */
export const getAdminData = (): AdminData | null => {
  if (typeof window === 'undefined') return null;
  
  const data = localStorage.getItem(ADMIN_DATA_KEY);
  return data ? JSON.parse(data) : null;
};

/**
 * Get admin settings from localStorage
 */
export const getAdminSettings = (): AdminSettings | null => {
  if (typeof window === 'undefined') return null;
  
  const data = localStorage.getItem(ADMIN_SETTINGS_KEY);
  return data ? JSON.parse(data) : null;
};

/**
 * Update admin settings
 * @param settings - Settings to update
 */
export const updateAdminSettings = (settings: Partial<AdminSettings>): void => {
  if (typeof window === 'undefined') return;
  
  const currentSettings = getAdminSettings() || {};
  const updatedSettings = { ...currentSettings, ...settings };
  
  localStorage.setItem(ADMIN_SETTINGS_KEY, JSON.stringify(updatedSettings));
};

/**
 * Clear all admin data
 */
export const clearAdminData = (): void => {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem(ADMIN_DATA_KEY);
  localStorage.removeItem(ADMIN_SETTINGS_KEY);
}; 