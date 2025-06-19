import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
server: {
    host: true,
    port: 5173,
    strictPort: true,
    origin: 'https://09b1-80-29-143-44.ngrok-free.app', // tu subdominio ngrok
    hmr: {
        protocol: 'wss',
        clientPort: 443,
    },
},
    plugins: [
        laravel({
            input: ['resources/js/app.jsx'],
            refresh: true,
        }),
        react(),
    ],
});
