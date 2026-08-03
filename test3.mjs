import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  await page.goto('http://localhost:3000/');
  
  await page.waitForSelector('#gallery');
  
  const stats = await page.evaluate(() => {
    const gallery = document.querySelector('#gallery');
    const stickyDiv = gallery.querySelector('.lg\\:sticky');
    const rail = gallery.querySelector('.will-change-transform');
    const viewport = rail.parentElement;
    
    return {
      sectionHeight: gallery.clientHeight,
      stickyTop: window.getComputedStyle(stickyDiv).top,
      stickyPosition: window.getComputedStyle(stickyDiv).position,
      railScrollWidth: rail.scrollWidth,
      viewportWidth: viewport.clientWidth,
      firstCardWidth: rail.firstElementChild.clientWidth,
    };
  });
  
  console.log(stats);
  await browser.close();
})();
