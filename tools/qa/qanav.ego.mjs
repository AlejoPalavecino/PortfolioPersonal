const task = await taskSpace(1); const page = task.page('p1');
await page.goto('http://127.0.0.1:5173');
console.log(await page.evaluate(() => [...document.querySelectorAll('button')].map(x=>({text:x.innerText,html:x.outerHTML.slice(0,250)}))));
console.log(await page.snapshot());
