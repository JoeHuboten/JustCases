const fs = require('fs');
const path = require('path');

const validNodeEnvs = new Set(['development', 'production', 'test']);

if (!validNodeEnvs.has(process.env.NODE_ENV || '')) {
  process.env.NODE_ENV = 'production';
}

const standaloneEntry = path.join(process.cwd(), '.next', 'standalone', 'server.js');

if (!fs.existsSync(standaloneEntry)) {
  console.error(
    `Standalone entry not found at ${standaloneEntry}. Run "npm run build" before starting.`,
  );
  process.exit(1);
}

require(standaloneEntry);
