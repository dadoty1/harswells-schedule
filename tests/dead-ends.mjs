/* Dead-end routes: Home inbox/photos, chat tab, unknown pages, session landing.
   Fictional demo data only.
   Run: npm install puppeteer-core && node tests/dead-ends.mjs
   WebKit: BROWSER=webkit node tests/dead-ends.mjs (needs playwright-core). */
import { createServer } from 'node:http';
import { readFileSync, mkdirSync, existsSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

function loadPkg(name) {
  const fromHere = createRequire(import.meta.url);
  try { return fromHere(name); } catch (e) {}
  if (existsSync('/tmp/pw/package.json')) return createRequire('/tmp/pw/package.json')(name);
  throw new Error('Install ' + name + ' (npm install ' + name + ') to run this check');
}
const puppeteer = loadPkg('puppeteer-core');

async function launchBrowser() {
  if (process.env.BROWSER === 'webkit') {
    const { webkit } = loadPkg('playwright-core');
    const browser = await webkit.launch();
    return {
      async newPage() {
        const page = await browser.newPage();
        page.setViewport = function (size) { return page.setViewportSize({ width: size.width, height: size.height }); };
        return page;
      },
      close: () => browser.close()
    };
  }
  return puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
  });
}

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const CHROME = process.env.CHROME || '/usr/bin/google-chrome';
const SHOTS = process.env.SHOTS || '/tmp/hws-crawl';
const fail = [];

function check(name, ok, detail) {
  const line = (ok ? 'ok  ' : 'FAIL') + '  ' + name + (detail ? ' — ' + detail : '');
  console.log(line);
  if (!ok) fail.push(line);
}

function privacyScan() {
  const files = ['index.html', 'demo/index.html'];
  for (const file of files) {
    const text = readFileSync(join(ROOT, file), 'utf8');
    check(file + ' has no Restrepo or Walker', !/Restrepo|Walker/.test(text));
    check(file + ' has no dollar amount', !/\$\s?\d/.test(text));
    check(file + ' does not send photos at Files', !text.includes('Open a job folder to see them'));
    check(file + ' does not pretend mail is waiting', !text.includes('Slack and mail waiting to be filed'));
    check(file + ' does not say chat is coming soon', !text.includes('Team chat is coming soon'));
  }
}

function startServer() {
  const types = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.png': 'image/png', '.svg': 'image/svg+xml' };
  const server = createServer((req, res) => {
    const path = decodeURIComponent((req.url || '/').split('?')[0]);
    let rel = normalize(path).replace(/^(\.\.[/\\])+/, '');
    if (rel === '/' || rel === '') rel = '/index.html';
    const file = join(ROOT, rel);
    if (!file.startsWith(ROOT)) { res.writeHead(403); res.end('no'); return; }
    try {
      const body = readFileSync(file);
      res.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
      res.end(body);
    } catch (e) {
      res.writeHead(404);
      res.end('missing');
    }
  });
  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => resolve(server));
  });
}

async function text(page) {
  return page.evaluate(() => document.body ? document.body.innerText : '');
}

async function shot(page, name) {
  mkdirSync(SHOTS, { recursive: true });
  await page.screenshot({ path: join(SHOTS, name + '.png'), fullPage: false });
}

async function waitApp(page) {
  await page.waitForFunction(() => {
    const t = document.body ? document.body.innerText : '';
    return /Needs you today|Whitfield|Jobs/.test(t) && document.body.dataset && document.body.dataset.pg;
  }, { timeout: 25000 });
}

async function overflow(page) {
  return page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 8);
}

async function crawl(browser, origin) {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (err) => errors.push(String(err && err.message || err)));
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  const demo = origin + '/demo/index.html';
  await page.goto(demo + '#/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await waitApp(page);
  await shot(page, 'home-390');

  const home = await page.evaluate(() => {
    DATA.common.home_roles = Object.assign({}, DATA.common.home_roles, { 'Alex Morgan': 'staff' });
    renderHomeV3();
    const hrefs = Array.from(document.querySelectorAll('main a[href]')).map((a) => a.getAttribute('href'));
    return {
      role: homeRole(),
      layout: homeLayout(homeRole(), false),
      chatNav: !!document.querySelector('nav a[href="#/chat"]'),
      inbox: !!document.querySelector('[data-sec="inbox"]'),
      photos: !!document.querySelector('[data-sec="photos"]'),
      filesLink: hrefs.includes('#/files'),
      chatLink: hrefs.includes('#/chat'),
      nav: Array.from(document.querySelectorAll('nav.gtabs a span, nav.dnav a')).map((el) => el.textContent.trim()).filter(Boolean)
    };
  });
  check('staff home role', home.role === 'staff', JSON.stringify(home.role));
  check('staff home hides inbox', home.layout.indexOf('inbox') < 0 && !home.inbox, home.layout.join(','));
  check('staff home hides photos link', home.layout.indexOf('photos') < 0 && !home.photos, home.layout.join(','));
  check('home does not link to Files or Chat', !home.filesLink && !home.chatLink);
  check('chat tab is off by default', !home.chatNav, home.nav.join(' | '));
  check('chat switch defaults off', await page.evaluate(() => featureOn('chat') === false && featureOn('home_inbox') === false && featureOn('home_photos') === false && featureOn('money') === true));
  check('home fits the phone', !(await overflow(page)));
  await shot(page, 'home-staff-390');

  await page.evaluate(() => { location.hash = '#/jobs'; });
  await page.waitForFunction(() => document.body.dataset.pg === 'jobs' && /Whitfield/.test(document.body.innerText), { timeout: 15000 });
  check('jobs list shows a sample job', /Whitfield/.test(await text(page)));
  check('jobs fits the phone', !(await overflow(page)));
  await shot(page, 'jobs-390');

  await page.evaluate(() => { location.hash = '#/job/whitfield/schedule'; });
  await page.waitForFunction(() => document.body.dataset.pg === 'job' && document.getElementById('mod') && /Schedule|Whitfield/.test(document.getElementById('mod').innerText + document.body.innerText), { timeout: 15000 });
  const job = await page.evaluate(() => ({
    name: (document.querySelector('.jh h1') || {}).textContent || '',
    unavailable: !!document.querySelector('#mod [data-unavailable]'),
    schedule: !!document.querySelector('#mod .panel, #mod #sv')
  }));
  check('job page opens Whitfield', /Whitfield/.test(job.name), job.name);
  check('schedule is a real module', job.schedule && !job.unavailable);
  check('job fits the phone', !(await overflow(page)));
  await shot(page, 'job-390');

  await page.evaluate(() => { location.hash = '#/job/whitfield/submittals'; });
  await page.waitForFunction(() => document.querySelector('#mod [data-unavailable]'), { timeout: 10000 });
  const missingMod = await page.evaluate(() => {
    const box = document.querySelector('#mod [data-unavailable]');
    const back = box ? box.querySelector('a.pbtn') : null;
    return {
      text: box ? box.innerText : '',
      back: back ? back.getAttribute('href') : '',
      schedule: !!document.querySelector('#mod .panel, #mod #sv, #mod .gwrap')
    };
  });
  check('unknown job module is not the schedule', /isn't available yet/.test(missingMod.text) && !missingMod.schedule, missingMod.text.slice(0, 80));
  check('unknown job module links back to the job', missingMod.back === '#/job/whitfield/schedule', missingMod.back);
  await shot(page, 'job-missing-390');

  await page.evaluate(() => { location.hash = '#/job/whitfield/plans'; });
  await page.waitForFunction(() => {
    const mod = document.getElementById('mod');
    return mod && mod.innerText.trim().length > 12;
  }, { timeout: 10000 });
  const plans = await page.evaluate(() => (document.getElementById('mod') || {}).innerText || '');
  check('plan room is not treated as a missing module', !/isn't available yet/.test(plans), plans.slice(0, 80));

  await page.evaluate(() => { location.hash = '#/no-such-page'; });
  await page.waitForFunction(() => document.querySelector('main [data-unavailable]'), { timeout: 10000 });
  const missingPage = await page.evaluate(() => {
    const box = document.querySelector('main [data-unavailable]');
    const back = box ? box.querySelector('a[href="#/"]') : null;
    return { text: box ? box.innerText : '', back: !!back, needs: /Needs you today/.test(document.body.innerText) };
  });
  check('unknown hub page says it does not exist', /doesn't exist yet/.test(missingPage.text) && !missingPage.needs, missingPage.text.slice(0, 80));
  check('unknown hub page links home', missingPage.back);
  await shot(page, 'missing-page-390');

  await page.evaluate(() => { location.hash = '#/chat'; });
  await page.waitForFunction(() => /Team chat isn't available yet/.test(document.body.innerText), { timeout: 10000 });
  const chat = await text(page);
  check('chat page is honest', /isn't available yet/.test(chat) && /Nothing is waiting in an inbox here/.test(chat) && /Open Slack/.test(chat) && /Back to Home/.test(chat));
  check('chat page is not a coming-soon inbox', !/coming soon/i.test(chat));
  await shot(page, 'chat-390');

  await page.evaluate(() => { location.hash = '#/photos'; });
  await page.waitForFunction(() => /Photos aren't available here yet/.test(document.body.innerText), { timeout: 10000 });
  check('photos page does not open Files', /aren't available here yet/.test(await text(page)) && !(await page.evaluate(() => document.body.dataset.pg === 'files')));

  await page.evaluate(() => {
    if (!DATA.common.company) DATA.common.company = {};
    DATA.common.company.features = Object.assign({}, DATA.common.company.features, { chat: true, home_inbox: true, home_photos: true });
    location.hash = '#/';
  });
  await page.waitForFunction(() => document.body.dataset.pg === 'home', { timeout: 10000 });
  const switched = await page.evaluate(() => {
    renderHomeV3();
    const photo = document.querySelector('[data-sec="photos"] a');
    const inbox = document.querySelector('[data-sec="inbox"] a');
    return {
      chatNav: !!document.querySelector('nav a[href="#/chat"]'),
      photo: photo ? photo.getAttribute('href') : '',
      inbox: inbox ? inbox.getAttribute('href') : ''
    };
  });
  check('chat switch shows the tab', switched.chatNav);
  check('photos switch does not point at Files', switched.photo === '#/photos', switched.photo);
  check('inbox switch points at the chat page', switched.inbox === '#/chat', switched.inbox);

  const noisy = errors.filter((msg) => !/ResizeObserver|Script error/i.test(msg));
  check('demo crawl has no page errors', noisy.length === 0, noisy.slice(0, 3).join(' | '));
  await page.close();
}

async function guestShell(browser, origin) {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (err) => errors.push(String(err && err.message || err)));
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto(origin + '/index.html#/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForFunction(() => /Load from Dropbox|Sign in with Dropbox|Unlock/.test(document.body ? document.body.innerText : ''), { timeout: 20000 });
  const body = await text(page);
  await shot(page, 'guest-390');
  check('signed-out shell still loads', /Load from Dropbox|Sign in with Dropbox|Unlock/.test(body) && !/Could not start the app/.test(body), body.slice(0, 180).replace(/\s+/g, ' '));
  check('signed-out shell has no page error', errors.length === 0, errors.slice(0, 2).join(' | '));
  await page.close();
}

async function sessions(browser, origin) {
  const demo = origin + '/demo/index.html';
  const fresh = await browser.newPage();
  await fresh.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await fresh.goto(demo + '#/jobs', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await fresh.waitForFunction(() => document.body.dataset.pg === 'jobs', { timeout: 20000 });
  await fresh.evaluate(() => {
    localStorage.setItem('hws-last-view', '#/trackers');
    sessionStorage.removeItem('hws-last-view');
  });
  await fresh.goto(demo + '?fresh=1#/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await fresh.waitForFunction(() => document.body.dataset && document.body.dataset.pg, { timeout: 20000 });
  const freshPg = await fresh.evaluate(() => document.body.dataset.pg);
  check('fresh session opens Home', freshPg === 'home', freshPg);
  await fresh.close();

  const same = await browser.newPage();
  await same.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await same.goto(demo + '#/jobs', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await same.waitForFunction(() => document.body.dataset.pg === 'jobs', { timeout: 20000 });
  await same.evaluate(() => { sessionStorage.setItem('hws-last-view', '#/jobs'); });
  await same.goto(demo + '?same=1#/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await same.waitForFunction(() => document.body.dataset.pg === 'jobs' || document.body.dataset.pg === 'home', { timeout: 20000 });
  const samePg = await same.evaluate(() => ({ pg: document.body.dataset.pg, last: sessionStorage.getItem('hws-last-view'), hash: location.hash }));
  check('same session restores the last page', samePg.pg === 'jobs', JSON.stringify(samePg));
  await same.close();
}

const server = await startServer();
const origin = 'http://127.0.0.1:' + server.address().port;
privacyScan();
const browser = await launchBrowser();
try {
  await crawl(browser, origin);
  await guestShell(browser, origin);
  await sessions(browser, origin);
} finally {
  await browser.close();
  server.close();
}
if (fail.length) {
  console.error('\n' + fail.length + ' failed');
  process.exit(1);
}
console.log('\nall checks passed');
