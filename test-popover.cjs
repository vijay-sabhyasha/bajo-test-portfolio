const { chromium, devices } = require('playwright');

(async () => {
  // Desktop
  const browser = await chromium.launch();
  const contextDesktop = await browser.newContext();
  const pageDesktop = await contextDesktop.newPage();
  await pageDesktop.goto('http://localhost:3000');
  await pageDesktop.waitForTimeout(2000);

  await pageDesktop.evaluate(() => {
    document.querySelector('button[title="Radio"]').click();
  });
  await pageDesktop.waitForTimeout(3000); // wait for floating morph to finish
  await pageDesktop.screenshot({ path: 'desktop-after-click.png' });

  // hover manually via evaluate since it's floating
  await pageDesktop.evaluate(() => {
    const el = document.querySelector('button[title="Radio"]').parentElement;
    const event = new MouseEvent('mouseenter', { bubbles: true });
    el.dispatchEvent(event);
  });
  await pageDesktop.waitForTimeout(1000);
  await pageDesktop.screenshot({ path: 'desktop-hover.png' });

  await contextDesktop.close();

  // Mobile
  const mobileDevice = devices['Pixel 5'];
  const contextMobile = await browser.newContext({ ...mobileDevice });
  const pageMobile = await contextMobile.newPage();
  await pageMobile.goto('http://localhost:3000');
  await pageMobile.waitForTimeout(2000);

  await pageMobile.evaluate(() => {
    document.querySelector('button[title="Radio"]').click();
  });
  await pageMobile.waitForTimeout(3000); // Wait for floating morph
  await pageMobile.screenshot({ path: 'mobile-after-click.png' });

  // trigger long press
  await pageMobile.evaluate(() => {
    const el = document.querySelector('button[title="Radio"]');
    el.dispatchEvent(new TouchEvent('touchstart', { bubbles: true }));
  });
  await pageMobile.waitForTimeout(600); // longer than 500ms
  await pageMobile.screenshot({ path: 'mobile-long-press.png' });

  await contextMobile.close();
  await browser.close();
  console.log('Done screenshots.');
})();
