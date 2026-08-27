import fs from 'node:fs';
import path from 'node:path';

const outDir = '.vercel/output';

// 1. Create output structure
fs.mkdirSync(`${outDir}/static`, { recursive: true });
fs.cpSync('dist/client', `${outDir}/static`, { recursive: true });

// 2. Create the edge function
const funcDir = `${outDir}/functions/index.func`;
fs.mkdirSync(funcDir, { recursive: true });
fs.cpSync('dist/server', funcDir, { recursive: true });

fs.writeFileSync(`${funcDir}/.vc-config.json`, JSON.stringify({
  runtime: "edge",
  entrypoint: "server.js"
}));

// 3. Create routing config
fs.writeFileSync(`${outDir}/config.json`, JSON.stringify({
  version: 3,
  routes: [
    { handle: "filesystem" },
    { src: "/(.*)", dest: "/" }
  ]
}));

console.log('✅ Built Vercel Output API structure');
