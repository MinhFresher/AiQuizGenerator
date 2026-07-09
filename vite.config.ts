import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'; // Assuming Tailwind v4. If v3, remove this import.
import { fileURLToPath } from 'url';
import path from 'path';

// Fix for __dirname in ESM modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(() => {
  return {
    plugins: [
      react(), 
      tailwindcss() // Only keep this here if you are using Tailwind v4!
    ],
    resolve: {
      alias: {
        // Points @ directly to your src folder for cleaner imports
        '@': path.resolve(__dirname, './src'), 
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    // Perfect for GitHub Pages deployment!
    base: '/AiQuizGenerator/',
  };
});
