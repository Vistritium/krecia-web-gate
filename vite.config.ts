import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import {resolve} from 'node:path';

export default defineConfig({
    plugins: [react()],
    build: {
        outDir: 'build',
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                alarms: resolve(__dirname, 'alarms/index.html'),
            },
        },
    },
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: './src/setupTests.ts',
    },
});
