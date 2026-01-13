// Simple localStorage wrapper compatible with the artifact storage API
export const storage = {
  get: async (key) => {
    try {
      const value = localStorage.getItem(key);
      return value ? { key, value } : null;
    } catch (error) {
      console.error('Storage get error:', error);
      return null;
    }
  },
  
  set: async (key, value) => {
    try {
      localStorage.setItem(key, value);
      return { key, value };
    } catch (error) {
      console.error('Storage set error:', error);
      return null;
    }
  },
  
  delete: async (key) => {
    try {
      localStorage.removeItem(key);
      return { key, deleted: true };
    } catch (error) {
      console.error('Storage delete error:', error);
      return null;
    }
  },
  
  list: async (prefix = '') => {
    try {
      const keys = Object.keys(localStorage).filter(k => k.startsWith(prefix));
      return { keys, prefix };
    } catch (error) {
      console.error('Storage list error:', error);
      return { keys: [], prefix };
    }
  }
};

// Make it available globally for compatibility
if (typeof window !== 'undefined') {
  window.storage = storage;
}
