const task = await taskSpace(1); const page = task.page('p1'); await page.click('text=Reintentar escena'); await page.waitForTimeout(1000); console.log(await page.snapshot({scope:'full_page'}));
