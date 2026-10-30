const task = await taskSpace(1); const page = task.page('p1'); await page.reload(); await page.waitForTimeout(1000); console.log('RELOAD',await page.url(),await page.snapshot({scope:'full_page'}));
