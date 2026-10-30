const task = await taskSpace(1); const page = task.page('p1'); await page.goto('http://127.0.0.1:4173/#contacto'); await page.waitForTimeout(1000);
console.log('MAIL',await page.evaluate(()=>[...document.querySelectorAll('a[href^="mailto:"]')].map(a=>({text:a.textContent.trim(),href:a.getAttribute('href')}))));
console.log('BEFORE',await page.evaluate(()=>[...document.querySelectorAll('[data-action="sound"]')].map(e=>({label:e.getAttribute('aria-label'),pressed:e.getAttribute('aria-pressed')}))));
await page.click('loc=css:[data-action="sound"]'); console.log('AFTER',await page.evaluate(()=>({buttons:[...document.querySelectorAll('[data-action="sound"]')].map(e=>({label:e.getAttribute('aria-label'),pressed:e.getAttribute('aria-pressed')})),audio:[...document.querySelectorAll('audio')].map(a=>({paused:a.paused,muted:a.muted,error:a.error?.code}))})));
await page.click('loc=css:[data-action="sound"]');
