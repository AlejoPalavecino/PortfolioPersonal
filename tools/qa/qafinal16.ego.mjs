const task = await taskSpace(1); const page = task.page('p1'); await page.goto('http://127.0.0.1:4173'); await page.waitForTimeout(1000);
await page.click('loc=css:[aria-label="Navegación principal"] [data-section="projects"]');
const other = await task.newPage(); await other.goto('about:blank'); await other.waitForTimeout(2000);
console.log('P1',await page.snapshot({scope:'full_page'}));
