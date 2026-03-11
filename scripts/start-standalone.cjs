const fs = require('fs');
const path = require('path');

process.on('uncaughtException', (err) => {
  console.error('[start] FATAL uncaught exception:', err);
  process.exit(1);
});
process.on('unhandledRejection', (reason) => {
  console.error('[start] FATAL unhandled rejection:', reason);
  process.exit(1);
});

const validNodeEnvs = new Set(['development', 'production', 'test']);

if (!validNodeEnvs.has(process.env.NODE_ENV || '')) {
  process.env.NODE_ENV = 'production';
}

const standaloneEntry = path.join(process.cwd(), '.next', 'standalone', 'server.js');

console.log('[start] Node version :', process.version);
console.log('[start] NODE_ENV     :', process.env.NODE_ENV);
console.log('[start] PORT         :', process.env.PORT || '(not set — will use 3000)');
console.log('[start] HOSTNAME     :', process.env.HOSTNAME || '(not set)');
console.log('[start] CWD          :', process.cwd());
console.log('[start] Entry        :', standaloneEntry);

if (!fs.existsSync(standaloneEntry)) {
  console.error(
    `[start] ERROR: Standalone entry not found at ${standaloneEntry}. Run "npm run build" before starting.`,
  );
  process.exit(1);
}

console.log('[start] Launching Next.js standalone server...');
require(standaloneEntry);
