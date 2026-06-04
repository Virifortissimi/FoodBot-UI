const fs = require('fs');
const path = require('path');

const distRoot = path.resolve(__dirname, '..', 'dist', 'foodbot-ui');
const blockedPatterns = [
  /https?:\/\/localhost\b/i,
  /https?:\/\/127\.0\.0\.1\b/i,
  /https?:\/\/0\.0\.0\.0\b/i,
  /https?:\/\/\[::1\]\b/i,
];
const scannedExtensions = new Set([
  '.html',
  '.js',
  '.mjs',
  '.css',
  '.json',
  '.webmanifest',
]);

if (!fs.existsSync(distRoot)) {
  console.error(`Production safety check failed: ${distRoot} does not exist.`);
  process.exit(1);
}

const offenders = [];

function scanFile(filePath) {
  if (!scannedExtensions.has(path.extname(filePath))) {
    return;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const matchedPattern = blockedPatterns.find((pattern) => pattern.test(content));
  if (matchedPattern) {
    offenders.push(path.relative(distRoot, filePath));
  }
}

function scanDirectory(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanDirectory(fullPath);
      continue;
    }

    if (entry.isFile()) {
      scanFile(fullPath);
    }
  }
}

scanDirectory(distRoot);

if (offenders.length > 0) {
  console.error('Production safety check failed: local URLs were found in build output.');
  for (const offender of offenders) {
    console.error(`- ${offender}`);
  }
  process.exit(1);
}

console.log('Production safety check passed: no localhost URLs found in build output.');
