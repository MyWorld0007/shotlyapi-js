# ShotlyAPI - Node.js SDK

Official Node.js SDK for [ShotlyAPI](https://shotlyapi.in) - the website screenshot API with INR pricing.

**Free tier: 20 screenshots. No credit card. No expiry.** [Get your API key](https://shotlyapi.in/signup)

## Why ShotlyAPI?

- One HTTP call - real Chromium renders any URL to PNG, JPEG or PDF
- INR pricing built for developers billing in rupees (no forex fees)
- Full-page capture, mobile/tablet/4K viewports, ad + cookie-banner blocking
- CSS/JS injection, dark mode emulation, text extraction
- Bulk mode: up to 50 URLs per request
- Runs on Cloudflare edge - cached captures return in under 500ms

## Install

```bash
npm install shotlyapi
```

Requires Node.js 18+ (uses native fetch). Zero dependencies.

## Quick Start

```javascript
const ShotlyAPI = require('shotlyapi');

const client = new ShotlyAPI(process.env.SHOTLY_API_KEY);

(async () => {
  const png = await client.screenshot('https://example.com');
  require('fs').writeFileSync('screenshot.png', png);
  console.log('Saved screenshot.png');
})();
```

## API

### `client.screenshot(url, options)`

Returns the capture as a `Buffer`.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `full_page` | boolean | false | Capture the entire scrollable page |
| `viewport` | string | desktop | `mobile`, `tablet`, `desktop`, `4k` |
| `width` / `height` | number | - | Custom viewport size in px |
| `type` | string | png | `png`, `jpeg` or `pdf` |
| `quality` | number | - | JPEG quality 1-100 |
| `block_ads` | boolean | false | Remove ads and cookie banners |
| `inject_css` | string | - | CSS injected before capture |
| `inject_js` | string | - | JS executed before capture |
| `wait` | number | - | Wait N ms after load before capture |
| `dark_mode` | boolean | false | Emulate dark color scheme |
| `extract_text` | boolean | false | Also return visible page text |

### `client.bulk(urls, options)`

Capture up to 50 URLs in one call.

```javascript
const results = await client.bulk([
  'https://example.com',
  'https://github.com'
], { full_page: true });
```

## Examples

```javascript
// Full page, mobile, no cookie banners
const png = await client.screenshot('https://example.com', {
  full_page: true,
  viewport: 'mobile',
  block_ads: true
});

// PDF export
const pdf = await client.screenshot('https://example.com', {
  type: 'pdf',
  full_page: true
});
require('fs').writeFileSync('page.pdf', pdf);

// Hide an element before capturing
const clean = await client.screenshot('https://example.com', {
  inject_css: '.newsletter-popup, .cookie-banner { display: none !important; }'
});
```

More examples in [examples/](examples/).

## Pricing

| Plan | Price | Screenshots |
|------|-------|-------------|
| Free | Rs.0 | 20 (no card, no expiry) |
| Trial | Rs.99 one-time | 100 / 7 days |
| Starter | Rs.499/mo | 2,000 |
| Growth | Rs.899/mo | 4,000 |
| Pro | Rs.1,799/mo | 10,000 |

Details: [shotlyapi.in/billing](https://shotlyapi.in/billing)

## Error handling

```javascript
try {
  const png = await client.screenshot('https://example.com');
} catch (err) {
  if (err.status === 401) console.error('Invalid API key');
  else if (err.status === 429) console.error('Plan limit reached - upgrade at shotlyapi.in/billing');
  else throw err;
}
```

## Links

- Sign up (30 seconds): [shotlyapi.in/signup](https://shotlyapi.in/signup)
- Try without an account: [shotlyapi.in/playground](https://shotlyapi.in/playground)
- API docs: [shotlyapi.in/docs](https://shotlyapi.in/docs)
- Other languages (cURL, Python, PHP, Go): [shotlyapi-examples](https://github.com/MyWorld0007/shotlyapi-examples)

## License

MIT
