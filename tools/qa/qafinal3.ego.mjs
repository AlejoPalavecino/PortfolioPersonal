const task = await taskSpace(1); const page = task.page('p1');
console.log(await page.snapshot({scope:'full_page'})); console.log(await page.evaluate(() => [...document.querySelectorAll('.content-panel,.panel')].map(e=>e.outerHTML.slice(0,400))));
