const task = await taskSpace(1); const page = task.page('p1');
await page.goto('http://127.0.0.1:4173'); await page.waitForTimeout(1000);
const before=await page.evaluate(()=>history.length); await page.click('loc=css:[aria-label="Navegación principal"] [data-section="projects"]'); await page.click('text=Cancelar recorrido');
console.log('HISTORY_CANCEL',before,await page.evaluate(()=>history.length),await page.url());
await page.click('loc=css:[aria-label="Navegación principal"] [data-section="projects"]'); await page.click('text=Abrir ahora');
await page.click('loc=css:.panel [data-project="foxmind"]'); console.log('DETAIL',await page.url(),await page.snapshot({scope:'full_page'}));
console.log('PDF',await page.fetch('/assets/cv-alejo-palavecino-es.pdf',{method:'HEAD'}));
