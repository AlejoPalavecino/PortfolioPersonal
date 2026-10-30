const task = await taskSpace(1); const page = task.page('p1');
await page.cdp('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
console.log(await page.snapshot());
await page.click('text=Menú');
console.log('MENU', await page.snapshot({scope:'full_page'}));
await page.click('text=Reducir movimiento');
console.log('REDUCED', await page.snapshot({scope:'full_page'}));
