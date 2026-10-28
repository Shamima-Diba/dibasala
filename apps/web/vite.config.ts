import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Keep framework and backend-client code out of the application entry chunk.
        // This reduces initial parse/compile cost and lets the browser cache vendor code
        // independently from DIBASALA's learner-facing UI.
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;
          if (/[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/.test(id)) {
            return 'react-vendor';
          }
          if (id.includes('/node_modules/@supabase/')) {
            return 'supabase-vendor';
          }
          if (id.includes('/node_modules/lucide-react/')) {
            return 'icons-vendor';
          }
          return undefined;
        },
      },
    },
  },
});
