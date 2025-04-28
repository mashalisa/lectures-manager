class LRUCache {
    constructor(limit = 10) {
      this.cache = new Map();
      this.limit = limit;
    }
  
    get(key) {
      if (!this.cache.has(key)) return null;
  
      // Refresh the key by deleting and re-setting it
      const value = this.cache.get(key);
      this.cache.delete(key);
      this.cache.set(key, value); // re-insert it as most recently used
      return value;
    }
  
    set(key, value) {
      if (this.cache.has(key)) {
        // If key exists, delete it to refresh order
        this.cache.delete(key);
      } else if (this.cache.size >= this.limit) {
        // Delete least recently used (first item)
        const oldestKey = this.cache.keys().next().value;
        this.cache.delete(oldestKey);
      }
  
      this.cache.set(key, value);
    }
  
    has(key) {
      return this.cache.has(key);
    }
  
    print() {
      console.log([...this.cache.entries()]);
    }
  }