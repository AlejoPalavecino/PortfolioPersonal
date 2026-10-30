const task = await taskSpace(1); const page = task.page('p1');
await page.cdp('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
console.log(await page.snapshot({scope:'full_page'}));
await page.click('loc=css:[aria-label="Volver al campamento"]');
console.log(await page.snapshot({scope:'full_page'}));
await page.click('text=Contactar');
console.log('CONTACT', await page.snapshot({scope:'full_page'}));
console.log('SHOT', await page.screenshot({path:'C:/Users/alejo/AppData/Local/Temp/portfolio-mobile-contact.png'}));
