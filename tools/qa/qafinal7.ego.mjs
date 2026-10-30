const task = await taskSpace(1); const page = task.page('p1'); await page.cdp('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
await page.goto('http://127.0.0.1:4173'); await page.waitForTimeout(1000); await page.click('text=Menú');
console.log('SHOT',await page.screenshot({path:'C:/Users/alejo/AppData/Local/Temp/portfolio-final-menu-fixed.png'}));
await page.click('text=Reducir movimiento'); await page.click('loc=css:.mobile-menu [data-section="projects"]');
await page.click('text=Menú'); await page.click('loc=css:.mobile-menu [data-section="projects"]');
console.log('SAME',await page.evaluate(()=>({focus:document.activeElement?.outerHTML,heading:document.querySelector('.panel h2')?.textContent,scrollWidth:document.documentElement.scrollWidth})));
console.log(await page.snapshot({scope:'full_page'}));
