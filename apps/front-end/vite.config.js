// @fuyeor/reference-front-end/vite.config.js
import { existsSync, statSync, createReadStream } from 'node:fs';
import { join, resolve } from 'node:path';
import { defineConfig, loadEnv } from 'vite';
import { createViteConfig } from '@fuyeor/config/vite.config.js';

export default defineConfig(({ mode }) => {
  const contentDir = resolve(import.meta.dirname, '../../content');

  return createViteConfig(
    {
      server: {
        host: '0.0.0.0',
        port: 6020,
        allowedHosts: ['reference.localhost'],
        fs: {
          allow: [contentDir],
        },
        proxy: {
          // proxy to back-end
          '/v1': {
            target: 'http://localhost:3000',
            changeOrigin: true,
            // rewrite: (path) => path.replace(/^\/v1/, ''),
          },
        },
      },

      plugins: [
        {
          name: 'vite-plugin-local-v1-content-proxy',
          configureServer(server) {
            server.middlewares.use('/v1/content', (req, res, next) => {
              const cleanUrl = req.url.split('?')[0];
              const filePath = join(contentDir, cleanUrl);

              // 检查文件在磁盘上是否存在
              if (existsSync(filePath) && statSync(filePath).isFile()) {
                res.setHeader('Access-Control-Allow-Origin', '*');

                // 对齐 FFM 规范的本地 Mime-Types
                if (filePath.endsWith('.fon') || filePath.endsWith('.json')) {
                  res.setHeader(
                    'Content-Type',
                    'application/json; charset=utf-8',
                  );
                } else if (filePath.endsWith('.md')) {
                  res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
                } else {
                  res.setHeader('Content-Type', 'application/octet-stream');
                }

                createReadStream(filePath).pipe(res);
              } else {
                next();
              }
            });
          },
        },
      ],
    },
    import.meta.dirname,
  );
});
