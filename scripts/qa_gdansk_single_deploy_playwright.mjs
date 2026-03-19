import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const root = process.cwd();
const reportsDir = path.join(root, 'reports');
const profilesFile = path.join(root, 'data', 'gdanskTrainerProfiles.ts');
const baseUrl = (process.env.GDANSK_QA_BASE_URL || 'http://127.0.0.1:4173').replace(/\/+$/, '');

const mojibakeRe = /[ÃÅÄĹĂÂâ�]|�|[³¹æêñœŸ¿£ÆÊÑŒ¯]/;

function normalize(value) {
  return (value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function getProfiles() {
  const source = fs.readFileSync(profilesFile, 'utf8');
  const match = source.match(/export const gdanskTrainerProfiles:[^=]*=\s*(\{[\s\S]*\});/);
  if (!match) {
    throw new Error('Nie udało się odczytać gdanskTrainerProfiles z pliku TypeScript.');
  }
  const objectLiteral = match[1];
  const profiles = Function(`"use strict"; return (${objectLiteral});`)();
  return Object.values(profiles);
}

function csvEscape(value) {
  const text = `${value ?? ''}`;
  if (text.includes('"') || text.includes(',') || text.includes('\n')) {
    return `"${text.replaceAll('"', '""')}"`;
  }
  return text;
}

const rows = getProfiles().map((profile) => ({
  slug: profile.slug,
  title: profile.brandName || profile.fullName || profile.slug,
  email: (profile.email || '').trim(),
  phone: (profile.phone || '').trim(),
  vercelUrl: `${baseUrl}/t/${profile.slug}`,
}));

const browser = await chromium.launch({ headless: true });
const results = [];

try {
  for (const row of rows) {
    const issues = [];
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();

    page.on('pageerror', (error) => issues.push(`pageerror:${error.message}`));
    page.on('console', (msg) => {
      if (msg.type() === 'error' && !/favicon|Failed to load resource/i.test(msg.text())) {
        issues.push(`console:${msg.text()}`);
      }
    });

    try {
      const response = await page.goto(row.vercelUrl, { waitUntil: 'networkidle', timeout: 45000 });
      if (!response || !response.ok()) {
        issues.push(`http:${response ? response.status() : 'no-response'}`);
      }

      await page.waitForSelector('#main-content', { timeout: 15000 });
      await page.waitForSelector('#contact', { timeout: 15000 });
      await page.waitForSelector('h1', { timeout: 15000 });

      const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
      if (canonical !== row.vercelUrl) {
        issues.push(`canonical:${canonical || 'missing'}`);
      }

      const pageTitle = await page.title();
      const normalizedTitle = normalize(pageTitle);
      const expectedTokens = normalize(row.title)
        .split(/\s+/)
        .filter((token) => token.length > 3);
      if (expectedTokens.length > 0 && !expectedTokens.some((token) => normalizedTitle.includes(token))) {
        issues.push(`title-mismatch:${pageTitle}`);
      }

      const schemaRaw = await page.locator('#local-business-schema').textContent();
      if (!schemaRaw) {
        issues.push('missing-schema');
      } else {
        const schema = JSON.parse(schemaRaw);
        if (row.email && (schema.email || '').trim() !== row.email) {
          issues.push(`schema-email:${schema.email || 'missing'}`);
        }
        if (row.phone && (schema.telephone || '').trim() !== row.phone) {
          issues.push(`schema-phone:${schema.telephone || 'missing'}`);
        }
      }

      const bodyText = await page.locator('body').innerText();
      if (mojibakeRe.test(bodyText)) {
        issues.push('mojibake-visible');
      }
    } catch (error) {
      issues.push(`exception:${error.message}`);
    }

    results.push({
      ...row,
      qa: issues.length === 0 ? 'pass' : 'fail',
      details: issues.join(' | ') || 'ok',
    });

    await context.close();
  }
} finally {
  await browser.close();
}

const total = results.length;
const pass = results.filter((item) => item.qa === 'pass').length;
const failRows = results.filter((item) => item.qa === 'fail');

const timestamp = new Date().toISOString().replace(/[-:TZ.]/g, '').slice(0, 14);
const csvPath = path.join(reportsDir, `gdansk_single_deploy_qa_${timestamp}.csv`);
const mdPath = path.join(reportsDir, `gdansk_single_deploy_qa_${timestamp}.md`);

const csvLines = [
  'slug,title,email,phone,vercel_url,qa,details',
  ...results.map((item) =>
    [
      item.slug,
      item.title,
      item.email,
      item.phone,
      item.vercelUrl,
      item.qa,
      item.details,
    ]
      .map(csvEscape)
      .join(','),
  ),
];
fs.writeFileSync(csvPath, `${csvLines.join('\n')}\n`, 'utf8');

const mdLines = [
  `# Gdansk Single Deploy QA (${new Date().toISOString()})`,
  '',
  `- base_url: ${baseUrl}`,
  `- total: ${total}`,
  `- pass: ${pass}`,
  `- fail: ${failRows.length}`,
  '',
  '## Failures',
  ...(failRows.length
    ? failRows.map((item) => `- ${item.slug} -> ${item.details}`)
    : ['- none']),
  '',
];
fs.writeFileSync(mdPath, mdLines.join('\n'), 'utf8');

console.log(`QA_DONE total=${total} pass=${pass} fail=${failRows.length}`);
console.log(`CSV=${csvPath}`);
console.log(`MD=${mdPath}`);
