import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    base: '/2048_cyber/',
    plugins: [react()],
    server: {
        host: true,
        port: 5173,
    },
});

