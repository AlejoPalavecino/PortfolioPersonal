const task = await taskSpace(1); const page = task.page('p1');
await page.goto('http://127.0.0.1:4173'); await page.waitForTimeout(1500);
console.log(await page.snapshot({scope:'full_page'}));
