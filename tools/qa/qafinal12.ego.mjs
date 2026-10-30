const task = await taskSpace(1); const page = task.page('p1'); await page.goto('http://127.0.0.1:4173'); await page.waitForTimeout(1000);
console.log(await page.evaluate(()=>[...document.images].map(x=>x.src)));
await page.focus('loc=css:.world-label.label-projects'); await page.keyboard.press('Enter'); console.log('KEY',await page.snapshot({scope:'full_page'}));
