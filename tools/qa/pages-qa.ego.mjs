const task = await taskSpace('qa-publicacion-portfolio');
const page = task.page('p1');
await page.goto('http://127.0.0.1:4174/PortfolioPersonal/');
await page.waitForTimeout(1500);
console.log('SPACE',task.spaceId);
console.log('SNAPSHOT',await page.snapshot({scope:'full_page'}));
console.log('ASSETS',await page.evaluate(() => ({images:[...document.images].map(e=>({src:e.currentSrc,loaded:e.complete&&e.naturalWidth>0})),styles:[...document.styleSheets].map(s=>s.href).filter(Boolean),meta:document.querySelector('meta[name="robots"]')?.content})));
console.log('DESKTOP',await page.screenshot({path:'C:/Users/alejo/AppData/Local/Temp/portfolio-pages-desktop.png'}));

