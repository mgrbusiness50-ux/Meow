import path from 'node:path';
import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const emptyStubPath = path.resolve(__dirname, 'src/utils/emptyModuleStub.ts');

export default defineConfig(({ command, mode }) => {
  const isBuild = command === 'build';
  const isProdBuild = isBuild && mode !== 'development';

  return {
    plugins: [tailwindcss()],
    server: {
      host: '0.0.0.0',
      port: 3000,
      allowedHosts: true,
      hmr: false,
    },
    define: isProdBuild
      ? {
          'import.meta.env.DEV': 'false',
          'import.meta.env.PROD': 'true',
        }
      : undefined,
    resolve: {
      alias: isBuild
        ? {
            xrblocks: emptyStubPath,
            three: emptyStubPath,
            '@dimforge/rapier3d-simd-compat': emptyStubPath,
            '@pmndrs/uikit': emptyStubPath,
            '@sparkjsdev/spark': emptyStubPath,
            '@mediapipe/tasks-audio': emptyStubPath,
            '@mediapipe/tasks-vision': emptyStubPath,
            'three-mesh-bvh': emptyStubPath,
            'three-pathfinding': emptyStubPath,
            'troika-three-text': emptyStubPath,
            './xr/CatScene.ts': emptyStubPath,
            '../xr/CatScene.ts': emptyStubPath,
          }
        : {},
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
      target: 'es2022',
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/@supabase/')) {
              return 'vendor-supabase';
            }
            if (id.includes('node_modules/@capacitor')) {
              return 'vendor-capacitor';
            }
            if (id.includes('node_modules/@capgo/')) {
              return 'vendor-updater';
            }
            if (id.includes('src/data/egyptLocations')) {
              return 'data-locations';
            }
            return undefined;
          },
        },
      },
    },
    test: {
      environment: 'jsdom',
      globals: true,
      include: ['tests/**/*.test.ts'],
    },
  };
});
