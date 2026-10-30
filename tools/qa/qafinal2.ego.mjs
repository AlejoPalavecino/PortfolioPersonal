const task = await taskSpace(1); const page = task.page('p1');
for (const section of ['projects','about','journey','contact']) {
 await page.goto('http://127.0.0.1:4173'); await page.waitForTimeout(1000);
 const t=Date.now(); await page.click(`loc=css:[aria-label="Navegación principal"] [data-section="${section}"]`);
 try { await page.waitForFunction(() => !!document.querySelector('.content-panel, .panel'),undefined,{timeout:20000}); console.log('ROUTE',section,Date.now()-t,await page.url()); }
 catch(e){console.log('FAIL',section,Date.now()-t,await page.snapshot({scope:'full_page'})); break;}
}
