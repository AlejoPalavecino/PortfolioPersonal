const task = await taskSpace(1); const page = task.page('p1');
for (const [section,title] of [['projects','Proyectos'],['about','Sobre mí'],['journey','Trayectoria'],['contact','Contacto']]) {
 await page.goto('http://127.0.0.1:5173');
 await page.waitForTimeout(1000);
 const t=Date.now();
 await page.click(`loc=css:[aria-label="Navegación principal"] [data-section="${section}"]`);
 try { await page.waitForFunction((heading) => [...document.querySelectorAll('h1,h2')].some(el=>el.textContent.trim()===heading && el.getBoundingClientRect().width>0),title,{timeout:25000}); console.log('ROUTE',section,Date.now()-t,'ms'); }
 catch(e) { console.log('ROUTE_FAILED',section,Date.now()-t,String(e)); }
}
console.log(await page.snapshot({scope:'full_page'}));
