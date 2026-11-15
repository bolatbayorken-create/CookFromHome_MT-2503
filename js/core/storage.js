window.CookFromHome = window.CookFromHome || {};

CookFromHome.storage = {
  read(key, fallback) {
    try {
      const storedValue = localStorage.getItem(key);
      return storedValue === null ? fallback : JSON.parse(storedValue);
    } catch {
      // Private browsing or damaged data should not stop the page from working.
      return fallback;
    }
  },

  write(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },
};
