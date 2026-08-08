import { readFileSync, writeFileSync } from 'fs';

const routesPath = new URL('../dist/_routes.json', import.meta.url).pathname;

try {
  const routes = JSON.parse(readFileSync(routesPath, 'utf8'));
  routes.exclude = routes.exclude.filter(
    (entry) => entry !== '/marketplace/*' && entry !== '/inventory/*'
  );
  writeFileSync(routesPath, JSON.stringify(routes, null, 2) + '\n');
  console.log('Patched _routes.json: removed /marketplace/* and /inventory/* from excludes.');
} catch (err) {
  console.error('Failed to patch _routes.json:', err.message);
  process.exit(1);
}
