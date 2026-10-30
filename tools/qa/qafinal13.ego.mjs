const task = await taskSpace(1); const page = task.page('p1');
await page.cdp('Network.enable',{}); await page.cdp('Network.setCacheDisabled',{cacheDisabled:true}); await page.cdp('Network.setBlockedURLs',{urls:['*camp-ground.webp*']});
await page.goto('http://127.0.0.1:4173'); await page.waitForTimeout(1500);
console.log('BLOCKED',await page.snapshot({scope:'full_page'}));
await page.click('loc=css:[aria-label="Navegación principal"] [data-section="contact"]'); console.log('CONTACT',await page.snapshot({scope:'full_page'}));
await page.cdp('Network.setBlockedURLs',{urls:[]}); await page.cdp('Network.setCacheDisabled',{cacheDisabled:false});
