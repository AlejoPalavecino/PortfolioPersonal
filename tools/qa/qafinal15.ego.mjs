const task = await taskSpace(1); const page = task.page('p1');
const downloadPromise = page.waitForEvent('download',{timeout:10000}); await page.click('loc=css:a[aria-label="Descargar CV original, pendiente de revisión"]');
const download = await downloadPromise; console.log('PDF_DOWNLOAD',download.suggestedFilename(),download.url());
await download.saveAs('C:/Users/alejo/AppData/Local/Temp/portfolio-cv-qa.pdf');
