const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    colorScheme: 'dark'
  });
  const page = await context.newPage();

  page.on('console', msg => {
    if (msg.text().includes('Could not skip track') || msg.text().includes('INTERNAL PLAYER TYPE') || msg.text().includes('TARGET:')) {
        console.log('LOG:', msg.text());
    }
  });

  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');

  await page.click('button[title="Radio"]');
  await page.waitForTimeout(4000);

  // Expose function to log what player API holds
  await page.evaluate(() => {
    window.testNextTrackClick = () => {
       const btn = document.querySelector('button[title="Next Track"]');
       btn.click();
    };
  });

  await page.hover('div.floating-bounce', { force: true });
  await page.waitForTimeout(500);

  await page.evaluate(() => window.testNextTrackClick());
  await page.waitForTimeout(1000);

  await browser.close();
  console.log('Tested next track');
})();
