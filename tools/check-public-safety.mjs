import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join, extname } from 'node:path'

const root = join(process.cwd(), 'dist')
if (!existsSync(root)) throw new Error('Build dist/ first')
const allowed = new Set(['.html','.js','.css','.json','.xml','.txt','.pdf'])
const secretPatterns = [
  { label:'Identity number', rx: /\b(?:DNI|CUIL|CUIT)\s*[:#\-]?\s*\d[\d .-]{6,}/i },
  { label:'Personal phone', rx: /\+?54[\s.-]*9[\s.-]*\d{2,4}[\s.-]*\d{5,9}\b/ },
  { label:'API key or token', rx: /(?:sk-proj-|github_pat_|ghp_[A-Za-z0-9]{12,}|AKIA[0-9A-Z]{16})/ },
]
const files=[]
function walk(folder) {
  for(const entry of readdirSync(folder,{withFileTypes:true})) {
    const full=join(folder,entry.name)
    if(entry.isDirectory())walk(full)
    else if(allowed.has(extname(entry.name)))files.push(full)
  }
}
walk(root)
let failures=0
for(const path of files) {
  const body=readFileSync(path,'latin1')
  for(const {label,rx} of secretPatterns) if(rx.test(body)) { console.error('PUBLIC SAFETY: '+label+' in '+path); failures++ }
}
const html=readFileSync(join(root,'index.html'),'utf8')
if (!/name="robots" content="index, follow/i.test(html)) { console.error('SEO indexability missing'); failures++ }
if (!/rel="canonical"/.test(html)||!/application\/ld\+json/.test(html)) { console.error('SEO metadata missing'); failures++ }
const expectedDomain = 'https://alejopalavecino.com.ar/'
const sitemap = readFileSync(join(root, 'sitemap.xml'), 'utf8')
const robots = readFileSync(join(root, 'robots.txt'), 'utf8')
if (!html.includes('rel="canonical" href="' + expectedDomain + '"') ||
    !html.includes('property="og:url" content="' + expectedDomain + '"') ||
    !html.includes('property="og:image" content="' + expectedDomain + 'assets/share.webp"') ||
    !html.includes('href="' + expectedDomain + '?lang=en"') ||
    !sitemap.includes(expectedDomain + '?lang=en') ||
    !robots.includes(expectedDomain + 'sitemap.xml')) {
  console.error('Public domain, social sharing, hreflang or sitemap mismatch')
  failures++
}
if (html.includes('alejopalavecino.github.io/PortfolioPersonal/') ||
    sitemap.includes('alejopalavecino.github.io/PortfolioPersonal/')) {
  console.error('Old public URL detected in canonical metadata or sitemap')
  failures++
}
const firstPaintOk = html.includes('id="startup-critical-css"') &&
  html.includes('class="startup-preboot"') &&
  html.includes('El campamento está despertando') &&
  html.includes('class="startup-track"')
if (!firstPaintOk) {
  console.error('Missing self-contained, visible first-paint fallback for slow mobile startup')
  failures++
}
for(const code of ['es','en']) {
  const path=join(root,'assets','cv-alejo-palavecino-'+code+'.pdf')
  if(!existsSync(path)) { console.error('Missing public resume: '+code); failures++; continue }
  const text=readFileSync(path,'latin1')
  if(!text.includes('ALEJO PALAVECINO')||!text.startsWith('%PDF-1.4')) {console.error('Invalid resume for '+code); failures++}
}
if(failures)process.exit(1)
console.log('Public safety checks passed: '+files.length+' text assets inspected, no secrets or identifiers detected')
