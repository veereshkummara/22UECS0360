const shortid = require('shortid');

class UrlStore {
  constructor() {
    this.urls = new Map(); // shortcode -> { originalUrl, createdAt, expiry, clicks: [] }
  }

  isValidShortcode(code) {
    return /^[a-zA-Z0-9_-]{4,10}$/.test(code);
  }

  generateUniqueShortcode() {
    let code;
    do {
      code = shortid.generate().slice(0, 6);
    } while (this.urls.has(code));
    return code;
  }

  addUrl(originalUrl, validityMinutes = 30, shortcode = null) {
    if (shortcode) {
      if (!this.isValidShortcode(shortcode)) {
        throw new Error('Invalid shortcode format');
      }
      if (this.urls.has(shortcode)) {
        throw new Error('Shortcode already exists');
      }
    } else {
      shortcode = this.generateUniqueShortcode();
    }
    const createdAt = new Date();
    const expiry = new Date(createdAt.getTime() + validityMinutes * 60000);
    this.urls.set(shortcode, {
      originalUrl,
      createdAt,
      expiry,
      clicks: []
    });
    return { shortcode, createdAt, expiry };
  }

  getUrl(shortcode) {
    return this.urls.get(shortcode);
  }

  addClick(shortcode, referrer = '', ip = '') {
    const urlEntry = this.urls.get(shortcode);
    if (!urlEntry) return;
    // Mock location based on IP (for demo, just return 'Unknown')
    const location = 'Unknown';
    urlEntry.clicks.push({
      timestamp: new Date(),
      referrer,
      location
    });
  }

  getStats(shortcode) {
    const urlEntry = this.urls.get(shortcode);
    if (!urlEntry) return null;
    return {
      originalUrl: urlEntry.originalUrl,
      createdAt: urlEntry.createdAt,
      expiry: urlEntry.expiry,
      totalClicks: urlEntry.clicks.length,
      clicks: urlEntry.clicks
    };
  }
}

module.exports = new UrlStore();
