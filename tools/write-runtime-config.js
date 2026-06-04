const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const outputPath = path.join(root, 'src', 'runtime-config.js');
const mode = process.argv.includes('--empty') ? 'empty' : 'local';

const env = mode === 'empty'
  ? {}
  : {
      ...readEnvFile(path.join(root, '.env')),
      ...readEnvFile(path.join(root, '.env.local')),
      ...process.env,
    };

const runtimeConfig = compact({
  apiUrl: env.FOODBOT_API_URL || env.API_URL,
  supabaseUrl: env.FOODBOT_SUPABASE_URL,
  supabaseKey: env.FOODBOT_SUPABASE_KEY,
  aiCoach: compact({
    enabled: parseBoolean(env.FOODBOT_AI_COACH_ENABLED),
    whatsappUrl: env.FOODBOT_AI_COACH_WHATSAPP_URL,
  }),
});

fs.writeFileSync(
  outputPath,
  `globalThis.__FOODBOT_CONFIG__ = ${JSON.stringify(runtimeConfig, null, 2)};\n`
);

console.log(`Wrote ${path.relative(root, outputPath)} for ${mode} runtime config.`);

function readEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return {};
  }

  const result = {};
  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    const equalsIndex = trimmed.indexOf('=');
    if (equalsIndex < 1) {
      continue;
    }

    const key = trimmed.slice(0, equalsIndex).trim();
    const rawValue = trimmed.slice(equalsIndex + 1).trim();
    result[key] = unquote(rawValue);
  }

  return result;
}

function unquote(value) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  return value;
}

function compact(value) {
  return Object.fromEntries(
    Object.entries(value).filter(([, entry]) => {
      if (entry == null || entry === '') {
        return false;
      }

      if (typeof entry === 'object' && !Array.isArray(entry)) {
        return Object.keys(entry).length > 0;
      }

      return true;
    })
  );
}

function parseBoolean(value) {
  if (value == null || value === '') {
    return undefined;
  }

  return ['1', 'true', 'yes', 'on'].includes(String(value).toLowerCase());
}
