// Location: src/lib/timeTracker.ts

interface TimeData {
  date: string;
  totalSeconds: number;
  sessionStart: number | null;
}

const STORAGE_KEY = 'user_study_time';

/**
 * Get today's date in YYYY-MM-DD format
 */
const getTodayDate = (): string => {
  return new Date().toISOString().split('T')[0];
};

/**
 * Get time data from localStorage
 */
const getTimeData = (): TimeData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return {
        date: getTodayDate(),
        totalSeconds: 0,
        sessionStart: null
      };
    }

    const data: TimeData = JSON.parse(stored);
    
    // Reset if it's a new day
    if (data.date !== getTodayDate()) {
      return {
        date: getTodayDate(),
        totalSeconds: 0,
        sessionStart: null
      };
    }

    return data;
  } catch (error) {
    console.error('Error reading time data:', error);
    return {
      date: getTodayDate(),
      totalSeconds: 0,
      sessionStart: null
    };
  }
};

/**
 * Save time data to localStorage
 */
const saveTimeData = (data: TimeData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving time data:', error);
  }
};

/**
 * Start tracking time
 */
export const startTracking = (): void => {
  const data = getTimeData();
  
  if (data.sessionStart === null) {
    data.sessionStart = Date.now();
    saveTimeData(data);
  }
};

/**
 * Stop tracking and save accumulated time
 */
export const stopTracking = (): void => {
  const data = getTimeData();
  
  if (data.sessionStart !== null) {
    const now = Date.now();
    const sessionDuration = Math.floor((now - data.sessionStart) / 1000);
    
    data.totalSeconds += sessionDuration;
    data.sessionStart = null;
    
    saveTimeData(data);
  }
};

/**
 * Get current total time studied today (including active session)
 */
export const getCurrentTimeStudied = (): { hours: number; minutes: number; totalSeconds: number } => {
  const data = getTimeData();
  let totalSeconds = data.totalSeconds;
  
  // Add current session time if tracking
  if (data.sessionStart !== null) {
    const now = Date.now();
    const currentSessionSeconds = Math.floor((now - data.sessionStart) / 1000);
    totalSeconds += currentSessionSeconds;
  }
  
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  
  return { hours, minutes, totalSeconds };
};

/**
 * Update the stored time (called periodically to save progress)
 */
export const updateStoredTime = (): void => {
  const data = getTimeData();
  
  if (data.sessionStart !== null) {
    const now = Date.now();
    const sessionDuration = Math.floor((now - data.sessionStart) / 1000);
    
    // Save current progress
    data.totalSeconds += sessionDuration;
    data.sessionStart = now; // Reset session start to now
    
    saveTimeData(data);
  }
};

/**
 * Initialize time tracking with event listeners
 */
export const initTimeTracking = (): (() => void) => {
  // Start tracking immediately
  startTracking();
  
  // Update stored time every 30 seconds
  const updateInterval = setInterval(() => {
    if (!document.hidden) {
      updateStoredTime();
    }
  }, 30000); // 30 seconds
  
  // Handle page visibility changes
  const handleVisibilityChange = () => {
    if (document.hidden) {
      stopTracking();
    } else {
      startTracking();
    }
  };
  
  // Handle page unload
  const handleBeforeUnload = () => {
    stopTracking();
  };
  
  // Add event listeners
  document.addEventListener('visibilitychange', handleVisibilityChange);
  window.addEventListener('beforeunload', handleBeforeUnload);
  
  // Return cleanup function
  return () => {
    clearInterval(updateInterval);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    window.removeEventListener('beforeunload', handleBeforeUnload);
    stopTracking();
  };
};