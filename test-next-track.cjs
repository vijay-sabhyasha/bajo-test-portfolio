const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    colorScheme: 'dark'
  });
  const page = await context.newPage();

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  // Navigate to local server
  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');

  // Play the radio to open it
  await page.click('button[title="Radio"]');
  // Wait for floating state and popover, let the video load
  await page.waitForTimeout(4000);

  // Hover over the floating radio player
  await page.hover('div.floating-bounce', { force: true });
  await page.waitForTimeout(500);

  // Click next track (force click since the parent might be animating)
  await page.click('button[title="Next Track"]', { force: true });
  await page.waitForTimeout(1000);

  await browser.close();
  console.log('Tested next track');
})();
