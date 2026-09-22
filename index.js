/**
 * ShotlyAPI - Node.js SDK
 * Website screenshot API with INR pricing.
 * Docs: https://shotlyapi.in/docs
 * Free tier: 20 screenshots, no credit card. https://shotlyapi.in/signup
 */

'use strict';

class ShotlyAPI {
  /**
   * @param {string} apiKey - Your ShotlyAPI key (https://shotlyapi.in/dashboard)
   * @param {object} [options]
   * @param {string} [options.baseUrl] - Override API base URL
   * @param {number} [options.timeout] - Request timeout in ms (default 60000)
   */
  constructor(apiKey, options = {}) {
    if (!apiKey || typeof apiKey !== 'string') {
      throw new Error('ShotlyAPI: an API key is required. Get one free at https://shotlyapi.in/signup');
    }
    this.apiKey = apiKey;
    this.baseUrl = options.baseUrl || 'https://api.shotlyapi.in';
    this.timeout = options.timeout || 60000;
  }

  /**
   * Take a screenshot of a URL. Returns the image (or PDF) as a Buffer.
   *
   * @param {string} url - The URL to capture
   * @param {object} [options]
   * @param {boolean} [options.full_page] - Capture the entire scrollable page
   * @param {string} [options.viewport] - 'mobile' | 'tablet' | 'desktop' | '4k'
   * @param {number} [options.width] - Viewport width in px
   * @param {number} [options.height] - Viewport height in px
   * @param {string} [options.type] - 'png' (default) | 'jpeg' | 'pdf'
   * @param {number} [options.quality] - JPEG quality 1-100
   * @param {boolean} [options.block_ads] - Remove ads and cookie banners
   * @param {string} [options.inject_css] - CSS injected before capture
   * @param {string} [options.inject_js] - JS executed before capture
   * @param {number} [options.wait] - Wait N ms after load before capture
   * @param {boolean} [options.dark_mode] - Emulate dark color scheme
   * @param {boolean} [options.extract_text] - Also return visible page text
   * @returns {Promise<Buffer>}
   */
  async screenshot(url, options = {}) {
    if (!url) throw new Error('ShotlyAPI: url is required');
    const params = new URLSearchParams({ url, ...options });
    const res = await this._fetch(`/api/screenshot?${params.toString()}`);
    return Buffer.from(await res.arrayBuffer());
  }

  /**
   * Screenshot many URLs in one call (up to 50).
   * @param {string[]} urls
   * @param {object} [options] - Same options as screenshot()
   * @returns {Promise<Array>} - Result per URL
   */
  async bulk(urls, options = {}) {
    if (!Array.isArray(urls) || urls.length === 0) {
      throw new Error('ShotlyAPI: bulk() expects a non-empty array of URLs');
    }
    const res = await this._fetch('/api/screenshot/bulk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ urls, ...options })
    });
    return res.json();
  }

  async _fetch(path, extra = {}) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeout);
    let res;
    try {
      res = await fetch(`${this.baseUrl}${path}`, {
        headers: { Authorization: `Bearer ${this.apiKey}` },
        signal: controller.signal,
        ...extra
      });
    } finally {
      clearTimeout(timer);
    }
    if (!res.ok) {
      let detail = '';
      try { detail = (await res.json()).error || ''; } catch (e) { /* ignore */ }
      const err = new Error(`ShotlyAPI error ${res.status}${detail ? ': ' + detail : ''}`);
      err.status = res.status;
      throw err;
    }
    return res;
  }
}

module.exports = ShotlyAPI;
module.exports.ShotlyAPI = ShotlyAPI;
module.exports.default = ShotlyAPI;
