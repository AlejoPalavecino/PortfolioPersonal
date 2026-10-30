const task = await taskSpace(1); const page = task.page('p1');
await page.click('@7');
console.log('DURING', await page.snapshot());
await page.waitForTimeout(5000);
console.log('AFTER', await page.snapshot({scope:'full_page'}));
console.log('SHOT', await page.screenshot({path:'C:/Users/alejo/AppData/Local/Temp/portfolio-projects.png'}));
