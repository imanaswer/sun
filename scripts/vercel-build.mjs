import fs from 'node:fs';
import path from 'node:path';

const outDir = '.vercel/output';

// 1. Create output structure
fs.mkdirSync(`${outDir}/static`, { recursive: true });
fs.cpSync('dist/client', `${outDir}/static`, { recursive: true });

// 2. Create the Node.js function
const funcDir = `${outDir}/functions/index.func`;
fs.mkdirSync(funcDir, { recursive: true });
fs.cpSync('dist/server', funcDir, { recursive: true });

// Write the adapter
const adapterCode = `import server from './server.js';
import { Readable } from 'node:stream';

export default async function handler(req, res) {
  const protocol = req.headers['x-forwarded-proto'] || 'http';
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const url = new URL(req.url, \`\${protocol}://\${host}\`);
  
  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (Array.isArray(value)) {
      value.forEach(v => headers.append(key, v));
    } else if (value) {
      headers.set(key, value);
    }
  }

  const init = {
    method: req.method,
    headers,
  };

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    init.body = new ReadableStream({
      start(controller) {
        req.on('data', chunk => controller.enqueue(chunk));
        req.on('end', () => controller.close());
        req.on('error', err => controller.error(err));
      }
    });
    init.duplex = 'half';
  }

  const request = new Request(url, init);
  
  try {
    const response = await server.fetch(request, process.env, { request: req, response: res });

    res.statusCode = response.status;
    
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    if (response.body) {
      const reader = response.body.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(value);
      }
      res.end();
    } else {
      res.end();
    }
  } catch (error) {
    console.error(error);
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
}
`;

fs.writeFileSync(`${funcDir}/index.mjs`, adapterCode);

fs.writeFileSync(`${funcDir}/.vc-config.json`, JSON.stringify({
  runtime: "nodejs22.x",
  handler: "index.mjs",
  launcherType: "Nodejs"
}));

// 3. Create routing config
//
// Without explicit headers the Build Output API serves everything as
// `max-age=0, must-revalidate`, so all 167MB of /public was revalidated on
// every repeat visit. Two rules, because the directory mixes two kinds of file:
//
//   - Vite's JS/CSS carry a content hash in the filename, so a changed file is
//     a changed URL and they can be cached forever.
//   - Media in /public is NOT content-hashed, so `immutable` would strip our
//     ability to swap a product photo. A month with revalidation instead:
//     ponytail: bump to immutable once these filenames carry hashes.
fs.writeFileSync(`${outDir}/config.json`, JSON.stringify({
  version: 3,
  routes: [
    {
      src: "^/assets/.*\\.(js|css|map)$",
      headers: { "cache-control": "public, max-age=31536000, immutable" },
      continue: true
    },
    {
      src: "^/assets/.*\\.(png|jpe?g|webp|avif|gif|svg|ico|mp4|webm|woff2?)$",
      headers: { "cache-control": "public, max-age=2592000, stale-while-revalidate=86400" },
      continue: true
    },
    { handle: "filesystem" },
    { src: "/(.*)", dest: "/" }
  ]
}));

console.log('✅ Built Vercel Output API structure for Node.js runtime');
