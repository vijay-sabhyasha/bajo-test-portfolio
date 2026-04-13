const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ recordVideo: { dir: '.' } });
  const videoPage = await context.newPage();
  await videoPage.goto('http://localhost:3000');
  await videoPage.waitForTimeout(2000);

  // Click the radio button
  await videoPage.locator('button[title="Radio"]').click();
  await videoPage.waitForTimeout(3000); // Wait for morph

  // Try to click using evaluate to bypass stable check
  await videoPage.evaluate(() => {
    document.querySelector('button[title="Radio"]').click();
  });
  await videoPage.waitForTimeout(2000); // Wait for morph

  await context.close();
  await browser.close();
  console.log('Done recording.');
})();
