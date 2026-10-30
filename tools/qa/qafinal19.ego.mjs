const task = await taskSpace(1); const page = task.page('p1'); await page.goto('http://127.0.0.1:4173'); await page.waitForTimeout(1000);
console.log(await page.evaluate(()=>[...document.querySelectorAll('img')].map(x=>({src:x.getAttribute('src'),class:x.className,style:x.getAttribute('style')}))));
