const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    colorScheme: 'dark'
  });
  const page = await context.newPage();

  // Navigate to local server
  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');

  // Play the radio to open it
  await page.click('button[title="Radio"]');
  // Wait for floating state and popover, let the video load
  await page.waitForTimeout(4000);

  // Use force to hover since it's animating
  await page.hover('div.floating-bounce', { force: true });
  await page.waitForTimeout(500);

  // Screenshot the popover with timeline
  await page.screenshot({ path: 'timeline-popover-loaded.png' });

  await browser.close();
  console.log('Saved timeline-popover-loaded.png');
})();
