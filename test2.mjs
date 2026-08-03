import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  await page.goto('http://localhost:3000/');
  
  await page.waitForSelector('#gallery');
  const gallery = await page.$('#gallery');
  const box = await gallery.boundingBox();
  
  // Remove overflow from html/body
  await page.evaluate(() => {
    document.documentElement.className = document.documentElement.className.replace('overflow-x-clip', '');
    document.body.className = document.body.className.replace('overflow-x-clip', '');
  });
  
  await page.evaluate(({y}) => window.scrollTo(0, y + 1500), {y: box.y});
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'scroll-1500-fixed.png' });
  
  await browser.close();
  console.log('Screenshots taken');
})();
