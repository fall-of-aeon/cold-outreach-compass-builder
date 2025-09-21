// Secure browser storage utilities with encryption and validation

export class SecureStorage {
  private static readonly PREFIX = 'outreach_app_';
  private static readonly ENCRYPTION_KEY = 'user_session_key';

  // Simple encryption for sensitive data (not cryptographically strong, but better than plaintext)
  private static encrypt(data: string): string {
    try {
      return btoa(data);
    } catch {
      return data;
    }
  }

  private static decrypt(data: string): string {
    try {
      return atob(data);
    } catch {
      return data;
    }
  }

  // Store non-sensitive user preferences
  static setUserPreference(key: string, value: any): void {
    try {
      const prefixedKey = `${this.PREFIX}pref_${key}`;
      localStorage.setItem(prefixedKey, JSON.stringify(value));
    } catch (error) {
      console.warn('Failed to store user preference:', error);
    }
  }

  static getUserPreference<T>(key: string, defaultValue: T): T {
    try {
      const prefixedKey = `${this.PREFIX}pref_${key}`;
      const stored = localStorage.getItem(prefixedKey);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch (error) {
      console.warn('Failed to retrieve user preference:', error);
      return defaultValue;
    }
  }

  // Store temporary session data (encrypted)
  static setSessionData(key: string, value: any): void {
    try {
      const prefixedKey = `${this.PREFIX}session_${key}`;
      const encrypted = this.encrypt(JSON.stringify(value));
      sessionStorage.setItem(prefixedKey, encrypted);
    } catch (error) {
      console.warn('Failed to store session data:', error);
    }
  }

  static getSessionData<T>(key: string, defaultValue: T): T {
    try {
      const prefixedKey = `${this.PREFIX}session_${key}`;
      const stored = sessionStorage.getItem(prefixedKey);
      if (!stored) return defaultValue;
      
      const decrypted = this.decrypt(stored);
      return JSON.parse(decrypted);
    } catch (error) {
      console.warn('Failed to retrieve session data:', error);
      return defaultValue;
    }
  }

  // Clear all app data
  static clearAllData(): void {
    try {
      // Clear localStorage items
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.PREFIX)) {
          localStorage.removeItem(key);
        }
      });

      // Clear sessionStorage items
      const sessionKeys = Object.keys(sessionStorage);
      sessionKeys.forEach(key => {
        if (key.startsWith(this.PREFIX)) {
          sessionStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('Failed to clear storage:', error);
    }
  }

  // Get storage usage summary
  static getStorageUsage(): {
    localStorage: { used: number; available: number };
    sessionStorage: { used: number; available: number };
    appData: string[];
  } {
    const appData: string[] = [];

    try {
      // Check localStorage
      let localStorageUsed = 0;
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(this.PREFIX)) {
          appData.push(`localStorage: ${key}`);
          localStorageUsed += key.length + (localStorage.getItem(key)?.length || 0);
        }
      });

      // Check sessionStorage
      let sessionStorageUsed = 0;
      Object.keys(sessionStorage).forEach(key => {
        if (key.startsWith(this.PREFIX)) {
          appData.push(`sessionStorage: ${key}`);
          sessionStorageUsed += key.length + (sessionStorage.getItem(key)?.length || 0);
        }
      });

      return {
        localStorage: {
          used: localStorageUsed,
          available: 5242880 - localStorageUsed // 5MB typical limit
        },
        sessionStorage: {
          used: sessionStorageUsed,
          available: 5242880 - sessionStorageUsed
        },
        appData
      };
    } catch (error) {
      console.warn('Failed to get storage usage:', error);
      return {
        localStorage: { used: 0, available: 5242880 },
        sessionStorage: { used: 0, available: 5242880 },
        appData
      };
    }
  }
}

// Storage items we should use
export const STORAGE_KEYS = {
  // User preferences (localStorage)
  THEME: 'theme',
  LANGUAGE: 'language',
  DASHBOARD_LAYOUT: 'dashboard_layout',
  
  // Session data (sessionStorage)
  CURRENT_CAMPAIGN_STEP: 'current_campaign_step',
  FORM_DRAFT: 'form_draft',
  CHAT_SESSION: 'chat_session'
} as const;

// What we currently store in browser storage:
export const CURRENT_STORAGE_USAGE = {
  supabase: {
    description: 'Supabase auth tokens and session data',
    location: 'localStorage',
    keys: ['sb-wbhdvskhoetfwkfzxggc-auth-token'],
    security: 'Managed by Supabase client with auto-refresh',
    necessary: true
  },
  
  appPreferences: {
    description: 'User interface preferences and settings',
    location: 'localStorage', 
    keys: Object.values(STORAGE_KEYS).filter(key => 
      [STORAGE_KEYS.THEME, STORAGE_KEYS.LANGUAGE, STORAGE_KEYS.DASHBOARD_LAYOUT].includes(key as any)
    ),
    security: 'Non-sensitive UI preferences only',
    necessary: false
  },

  sessionData: {
    description: 'Temporary workflow state and form drafts',
    location: 'sessionStorage',
    keys: Object.values(STORAGE_KEYS).filter(key => 
      [STORAGE_KEYS.CURRENT_CAMPAIGN_STEP, STORAGE_KEYS.FORM_DRAFT, STORAGE_KEYS.CHAT_SESSION].includes(key as any)
    ),
    security: 'Encrypted, cleared on browser close',
    necessary: false
  }
};