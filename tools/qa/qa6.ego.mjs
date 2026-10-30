const task = await taskSpace(1); const page = task.page('p1');
await page.cdp('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
await page.goto('http://127.0.0.1:5173');
console.log('MOBILE', await page.snapshot({scope:'full_page'}));
console.log('METRICS', await page.evaluate(() => ({width:innerWidth, client:document.documentElement.clientWidth, scrollWidth:document.documentElement.scrollWidth})));
console.log('SHOT', await page.screenshot({path:'C:/Users/alejo/AppData/Local/Temp/portfolio-mobile.png'}));
