import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({base:process.env.PD_BASE || '/pourdecisions/',plugins:[react(),tailwindcss()],build:{assetsDir:'build-assets',rollupOptions:{input:'app.html'}}});
