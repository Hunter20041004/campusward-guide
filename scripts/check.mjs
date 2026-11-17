import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
async function walk(directory) {
  const results = [];
  for (const item of await readdir(directory, { withFileTypes: true })) {
    if (item.name.startsWith('.') || item.name === 'node_modules') continue;
    const absolute = path.join(directory, item.name);
    results.push(...(item.isDirectory() ? await walk(absolute) : [absolute]));
  }
  return results;
}
const files = await walk(root);
const pages = files.filter(file => file.endsWith('.html'));
const errors = [];
let localLinks = 0;
for (const file of pages) {
  const source = await readFile(file, 'utf8');
  const relative = path.relative(root, file);
  for (const [label, pattern] of [
    ['頁面語言', /<html\s+lang="zh-Hant-TW"/],
    ['獨立標題', /<title>[^<]+<\/title>/],
    ['內容入口', /<main\s+id="main"/],
    ['目前章節', /aria-current="page"/],
    ['非官方說明', /非政大官方服務/],
    ['AI 協助註記', /以 AI 協助/],
  ]) if (!pattern.test(source)) errors.push(`${relative} 缺少${label}`);
  if ((source.match(/<h1(?:\s|>)/g) ?? []).length !== 1) errors.push(`${relative} 必須只有一個 h1`);
  const ids = [...source.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  if (new Set(ids).size !== ids.length) errors.push(`${relative} 有重複的區塊識別名稱`);
  for (const match of source.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const target = match[1];
    if (/^https?:\/\//.test(target)) continue;
    if (/^(?:javascript|data):/i.test(target)) { errors.push(`${relative} 不允許嵌入式連結`); continue; }
    const [filePart, fragment] = target.split('#');
    const resolved = filePart ? path.resolve(path.dirname(file), decodeURIComponent(filePart)) : file;
    if (!resolved.startsWith(`${root}${path.sep}`)) { errors.push(`${relative} 連到網站外的本機路徑`); continue; }
    try {
      if (!(await stat(resolved)).isFile()) throw new Error('not a file');
      if (fragment) {
        const content = await readFile(resolved, 'utf8');
        if (!content.includes(`id="${fragment}"`)) errors.push(`${relative} 的區塊連結不存在：${target}`);
      }
      localLinks++;
    } catch { errors.push(`${relative} 的本機連結不存在：${target}`); }
  }
}
const sensitivePatterns = [
  /AIza[0-9A-Za-z_-]{30,}/,
  /(?:sk-[A-Za-z0-9_-]{20,}|ghp_[A-Za-z0-9]{25,})/,
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /(?:\+886[- ]?|0)9\d{2}[- ]?\d{3}[- ]?\d{3}/,
  /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/,
];
for (const file of files.filter(file => /\.(?:html|css|js|mjs|md|json)$/.test(file))) {
  const source = await readFile(file, 'utf8');
  if (sensitivePatterns.some(pattern => pattern.test(source))) errors.push(`${path.relative(root, file)} 疑似含個資或金鑰，請人工確認`);
  if (/\.(?:js|mjs)$/.test(file)) execFileSync(process.execPath, ['--check', file]);
}
if (pages.length < 4) errors.push('需保留首頁與三篇指南');
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(`PASS：${pages.length} 頁、${localLinks} 個本機連結與資源，語法、錨點與敏感資訊樣式檢查通過`);
console.log('範圍：靜態檢查，未代替瀏覽器操作或外部網站查證');
