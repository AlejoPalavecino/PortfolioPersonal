const assert = require('node:assert/strict')
const { appendFileSync } = require('node:fs')
const { chromium } = require('playwright-core')

const url = process.env.PORTFOLIO_TEST_URL || 'https://alejopalavecino.com.ar/'
const viewport = { width: 390, height: 844 }

function observe() {
  const marks = window.campMarks = {}
  const record = key => { marks[key] ??= Math.round(performance.now()) }
  new MutationObserver(() => {
    const app = document.querySelector('#app')
    if (app?.dataset.introReady === 'true') record('welcomeMs')
    if (app?.dataset.prepared === 'true') record('preparedMs')
    if (app?.dataset.phase === 'explore' && app.querySelector('.intro')?.hidden) record('playableMs')
  }).observe(document, { subtree: true, attributes: true, childList: true,
    attributeFilter: ['data-intro-ready', 'data-prepared', 'data-phase', 'hidden'] })
}

async function visit(browser, direct = false) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: 2.75, isMobile: true, hasTouch: true,
    locale: 'es-AR', serviceWorkers: 'block' })
  try {
    await context.addInitScript(observe)
    const page = await context.newPage()
    const problems = []
    page.on('pageerror', e => problems.push(e.message))
    page.on('response', res => { if (res.status() >= 400) problems.push(`${res.status()} ${res.url()}`) })
    const cdp = await context.newCDPSession(page)
    await cdp.send('Network.enable')
    await cdp.send('Network.setCacheDisabled', { cacheDisabled: true })
    await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 80, downloadThroughput: 500000,
      uploadThroughput: 187500, connectionType: 'cellular4g' })
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 })
    const response = await page.goto(url, { waitUntil: 'commit', timeout: 30000 })
    assert.equal(response?.status(), 200, 'document HTTP status')
    assert.equal(response.url(), url, 'final URL')
    if (direct) {
      await page.locator('[data-action=direct]:visible').first().tap()
      assert.match(await page.locator('#reading-title').innerText(), /taller|proyectos/i)
      assert.deepEqual(problems, [])
      return
    }
    await page.locator('[data-action=skip-intro]').tap()
    await page.locator('#app[data-phase=explore]').waitFor()
    const buildings = page.locator('.world img.poi[src]')
    await buildings.nth(3).waitFor({ state: 'attached' })
    const stats = await buildings.evaluateAll(async images => {
      if (images.length !== 4) throw new Error('Expected four buildings')
      await Promise.all(images.map(image => image.decode()))
      await new Promise(done => requestAnimationFrame(() => requestAnimationFrame(done)))
      const nav = performance.getEntriesByType('navigation')[0]
      const { preparedMs } = window.campMarks
      const resources = performance.getEntriesByType('resource').filter(r => r.responseEnd <= preparedMs)
      return { ...window.campMarks, buildingsMs: Math.round(performance.now()), ttfbMs: Math.round(nav.responseStart),
        fcpMs: Math.round(performance.getEntriesByName('first-contentful-paint')[0]?.startTime),
        bytesAtReady: nav.encodedBodySize + resources.reduce((sum, r) => sum + r.encodedBodySize, 0),
        requestsAtReady: 1 + resources.length }
    })
    const assets = await page.evaluate(async () => ({
      js: document.querySelector('script[type=module][src]')?.getAttribute('src'),
      css: document.querySelector('link[rel=stylesheet]')?.getAttribute('href'),
      iconStatus: (await fetch(document.querySelector('link[rel=icon]').href)).status,
    }))
    assert.match(assets.js, /\/assets\/[^/]+\.js$/)
    assert.match(assets.css, /\/assets\/[^/]+\.css$/)
    assert.equal(assets.iconStatus, 200)
    assert.ok(Object.values(stats).every(Number.isFinite), 'missing performance mark')
    assert.deepEqual(problems, [])
    console.log(JSON.stringify({ url: response.url(), status: response.status(), assets, ...stats }))
    return stats
  } finally { await context.close() }
}

async function main() {
  const options = process.env.CHROME_BIN ? { executablePath: process.env.CHROME_BIN } : { channel: 'chrome' }
  const browser = await chromium.launch(options)
  try {
    const samples = []
    for (let i = 0; i < 3; i++) samples.push(await visit(browser))
    await visit(browser, true)
    const medians = Object.fromEntries(Object.keys(samples[0]).map(key =>
      [key, samples.map(s => s[key]).sort((a, b) => a - b)[1]]))
    const report = JSON.stringify({ url, browser: browser.version(), viewport,
      downloadMbps: 4, latencyMs: 80, cpuSlowdown: 4, medians, samples, directProjects: 'ok' }, null, 2)
    console.log(report)
    if (process.env.GITHUB_STEP_SUMMARY) {
      appendFileSync(process.env.GITHUB_STEP_SUMMARY, [
        '## Carga móvil en producción', '', url, '',
        'Medianas de tres visitas con caché vacía, 4 Mbps, 80 ms de latencia y CPU ralentizada 4×.',
        '', '| Medición | Tiempo |', '| --- | ---: |',
        ...[['Primer contenido', medians.fcpMs], ['Bienvenida interactiva', medians.welcomeMs],
          ['Campamento jugable', medians.playableMs], ['Cuatro edificios', medians.buildingsMs]]
          .map(([label, ms]) => `| ${label} | ${(ms / 1000).toFixed(2)} s |`),
        '', 'Acceso directo a Proyectos comprobado.', '',
      ].join('\n'))
    }
    assert.ok(medians.welcomeMs <= 3000, `Welcome exceeded 3 s: ${medians.welcomeMs} ms`)
    assert.ok(medians.playableMs <= 4000, `Camp exceeded 4 s: ${medians.playableMs} ms`)
  } finally { await browser.close() }
}
main().catch(error => { console.error(error); process.exitCode = 1 })
