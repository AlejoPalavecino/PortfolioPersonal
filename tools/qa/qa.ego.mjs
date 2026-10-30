const task = await taskSpace('qa-portfolio');
const page = task.page('p1');
await page.goto('http://127.0.0.1:5173');
console.log('SPACE', task.spaceId);
console.log(await page.snapshot());
console.log('SHOT', await page.screenshot({path:'C:/Users/alejo/AppData/Local/Temp/portfolio-desktop.png'}));
console.log('METRICS', await page.evaluate(() => ({width:innerWidth, scrollWidth:document.documentElement.scrollWidth, height:innerHeight, title:document.title})));
