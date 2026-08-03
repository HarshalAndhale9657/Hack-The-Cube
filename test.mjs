import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  await page.goto('http://localhost:3000/');
  
  await page.waitForSelector('#gallery');
  const gallery = await page.$('#gallery');
  const box = await gallery.boundingBox();
  
  await page.evaluate(({y}) => window.scrollTo(0, y), {y: box.y});
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'scroll-0.png' });
  
  await page.evaluate(({y}) => window.scrollTo(0, y + 500), {y: box.y});
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'scroll-500.png' });
  
  await page.evaluate(({y}) => window.scrollTo(0, y + 1500), {y: box.y});
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'scroll-1500.png' });
  
  const height = await page.evaluate(() => document.querySelector('#gallery').clientHeight);
  await page.evaluate(({y, h}) => window.scrollTo(0, y + h), {y: box.y, h: height});
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'scroll-end.png' });
  
  await browser.close();
  console.log('Screenshots taken');
})();
