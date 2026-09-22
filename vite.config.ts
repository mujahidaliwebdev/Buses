import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { defineConfig, loadEnv } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function staticRoutesPlugin() {
  return {
    name: 'static-routes-generator',
    closeBundle() {
      const distDir = path.resolve(__dirname, 'dist');
      const indexHtml = path.resolve(distDir, 'index.html');
      if (!fs.existsSync(indexHtml)) return;

      const content = fs.readFileSync(indexHtml, 'utf-8');

      // Create physical folders and index.html files so GitHub Pages serves 200 OK directly
      const routes = [
        'verify',
        'verify/ASP',
        'verify/ASP/EXP',
        'verify/ASP/EXP/2026051201',
        'schedules',
        'about',
        'contact',
        'policy',
        'privacy',
        'terms',
        'disclaimer',
        'blog',
        'team',
        'faqs',
        'sitemap'
      ];

      for (const route of routes) {
        const targetDir = path.resolve(distDir, route);
        if (!fs.existsSync(targetDir)) {
          fs.mkdirSync(targetDir, { recursive: true });
        }
        fs.writeFileSync(path.resolve(targetDir, 'index.html'), content);
      }
    }
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    base: '/',
    plugins: [react(), tailwindcss(), staticRoutesPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
