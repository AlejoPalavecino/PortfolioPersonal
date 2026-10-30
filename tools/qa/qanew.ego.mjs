const task = await taskSpace(1); const page = task.page('p1');
await page.cdp('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false}); await page.goto('http://127.0.0.1:5173'); await page.waitForTimeout(1500);
console.log('DESK', await page.screenshot({path:'C:/Users/alejo/AppData/Local/Temp/portfolio-desktop-new.png'}));
await page.cdp('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true}); await page.goto('http://127.0.0.1:5173'); await page.waitForTimeout(1500);
console.log('MOBILE',await page.screenshot({path:'C:/Users/alejo/AppData/Local/Temp/portfolio-mobile-new.png'}));
console.log(await page.snapshot({scope:'full_page'}));
