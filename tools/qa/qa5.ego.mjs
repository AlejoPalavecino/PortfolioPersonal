const task = await taskSpace(1); const page = task.page('p1');
console.log(await page.snapshot({scope:'full_page'}));
await page.click('@44');
console.log('PROJECT', await page.snapshot({scope:'full_page'}));
console.log('SHOT', await page.screenshot({path:'C:/Users/alejo/AppData/Local/Temp/portfolio-detail.png'}));
