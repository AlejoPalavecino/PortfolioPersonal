const task = await taskSpace(1); const page = task.page('p1');
await page.click('loc=css:[data-case="foxmind"]'); console.log('DETAIL_URL',await page.url()); console.log(await page.snapshot({scope:'full_page'}));
const url=await page.url(); await page.goto(url); console.log('DEEP',await page.snapshot({scope:'full_page'}));
const pdf=await page.fetch('/assets/cv-alejo-palavecino-es.pdf',{method:'HEAD'}); console.log('PDF',pdf.status,pdf.headers['content-type']);
