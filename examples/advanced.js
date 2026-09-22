// Advanced: full page, mobile, ad blocking, PDF, bulk
const ShotlyAPI = require('../index');

const client = new ShotlyAPI(process.env.SHOTLY_API_KEY);

(async () => {
  // 1. Full-page mobile capture with ads and cookie banners blocked
  const mobile = await client.screenshot('https://example.com', {
    full_page: true,
    viewport: 'mobile',
    block_ads: true
  });
  require('fs').writeFileSync('mobile-full.png', mobile);

  // 2. PDF export
  const pdf = await client.screenshot('https://example.com', {
    type: 'pdf',
    full_page: true
  });
  require('fs').writeFileSync('page.pdf', pdf);

  // 3. Hide elements via CSS injection
  const clean = await client.screenshot('https://example.com', {
    inject_css: '.popup, .newsletter-modal { display: none !important; }'
  });
  require('fs').writeFileSync('clean.png', clean);

  // 4. Bulk: 50 URLs in one call
  const results = await client.bulk([
    'https://example.com',
    'https://github.com'
  ], { full_page: true });
  console.log('Bulk done:', results);

  console.log('All examples saved.');
})();
