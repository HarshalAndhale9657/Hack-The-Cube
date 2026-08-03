import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  await page.goto('http://localhost:3000/');
  
  await page.waitForSelector('#gallery');
  
  const overflows = await page.evaluate(() => {
    return {
      html: window.getComputedStyle(document.documentElement).overflow,
      htmlX: window.getComputedStyle(document.documentElement).overflowX,
      body: window.getComputedStyle(document.body).overflow,
      bodyX: window.getComputedStyle(document.body).overflowX,
      main: window.getComputedStyle(document.querySelector('main')).overflow,
      section: window.getComputedStyle(document.querySelector('#gallery')).overflow,
    };
  });
  
  console.log('Overflows:', overflows);
  await browser.close();
})();
