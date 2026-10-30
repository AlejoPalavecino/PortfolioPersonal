const task = await taskSpace(1); const page = task.page('p1'); await page.cdp('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
await page.goto('http://127.0.0.1:4173'); await page.waitForTimeout(1000); await page.click('text=Menú');
console.log('MENU',await page.snapshot({scope:'full_page'}));
console.log('SHOT',await page.screenshot({path:'C:/Users/alejo/AppData/Local/Temp/portfolio-final-menu.png'}));
await page.click('text=Reducir movimiento'); await page.click('loc=css:.mobile-menu [data-section="projects"]');
console.log('DIRECT',await page.snapshot({scope:'full_page'}));
console.log('METRIC',await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,focus:document.activeElement?.outerHTML.slice(0,200)})));
