// Basic usage: capture one page
// Set your key first: export SHOTLY_API_KEY=your_key_here
const ShotlyAPI = require('../index');

const client = new ShotlyAPI(process.env.SHOTLY_API_KEY);

(async () => {
  const png = await client.screenshot('https://example.com');
  require('fs').writeFileSync('screenshot.png', png);
  console.log('Saved screenshot.png');
})();
