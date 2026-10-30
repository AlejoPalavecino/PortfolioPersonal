const task = await taskSpace(1); const page = task.page('p1');
console.log('BEFORE', await page.snapshot());
await page.click('text=Ver proyectos');
console.log('DURING', await page.snapshot());
await page.waitForTimeout(5000);
console.log('AFTER', await page.snapshot({scope:'full_page'}));
console.log('SHOT', await page.screenshot({path:'C:/Users/alejo/AppData/Local/Temp/portfolio-projects.png'}));
