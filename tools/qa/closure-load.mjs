// Run inside ego-browser, passing an authorized TaskSpace handle.
import assert from 'node:assert/strict';

export async function runLoadRegression(task, origin = 'http://127.0.0.1:4195') {
  const page = task.page('p1');
  const control = async mode => {
    const response = await fetch(`${origin}/_qa?mode=${mode}`);
    assert.equal(response.status, 200);
  };
  const state = () => page.evaluate(() => {
    const app = document.querySelector('#app');
    const scroll = document.querySelector('.panel-scroll');
    const active = document.activeElement;
    const bounds = active.getBoundingClientRect();
    return { hash: location.hash, phase: app.dataset.phase, reading: app.dataset.reading,
      load: app.dataset.load, position: app.dataset.position, routing: app.dataset.routing,
      scroll: scroll.scrollTop, focus: active.outerHTML, intro: document.querySelector('.intro').hidden,
      visible: bounds.top >= 0 && bounds.bottom <= innerHeight };
  });
  await page.cdp('Emulation.setDeviceMetricsOverride', {
    width: 844, height: 390, deviceScaleFactor: 1, mobile: false,
  });
  const reports = [];
  try {
    for (const failed of [false, true]) {
      await control(failed ? 'fail' : 'hold');
      await page.goto(`${origin}/PortfolioPersonal/`);
      if (failed) await page.waitForFunction(() => document.querySelector('#app').dataset.phase === 'direct');
      await page.click('text="Ver portfolio sin recorrer"');
      await page.click('loc=css:button[data-case="flower"]');
      if (failed) {
        await control('hold');
        await page.click('loc=css:.panel-header [data-action="retry"]');
      }
      await page.focus('loc=css:.panel-scroll a.primary');
      await page.waitForFunction(() => {
        const scroll = document.querySelector('.panel-scroll');
        const bounds = document.activeElement.getBoundingClientRect();
        return scroll.scrollTop > 0 && bounds.top >= 0 && bounds.bottom <= innerHeight;
      });
      const before = await state();
      assert.notEqual(before.load, '28/28', 'Resource must still be held');
      await control('release');
      await page.waitForFunction(() => document.querySelector('#app').dataset.load === '28/28');
      const after = await state();
      for (const key of ['hash', 'phase', 'reading', 'position', 'routing', 'scroll', 'focus', 'intro', 'visible']) {
        assert.deepEqual(after[key], before[key], `${key} changed when preparation completed`);
      }
      assert.equal(after.intro, true);
      assert.equal(after.visible, true);
      reports.push({ scenario: failed ? 'failure-retry-ready' : 'hold-ready', before, after });
    }
    console.log(JSON.stringify(reports, null, 2));
    return reports;
  } finally {
    await control('release');
  }
}
