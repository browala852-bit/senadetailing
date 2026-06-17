// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

// SSR on Vercel (serverless). Marketing pages prerender to static; the booking
// endpoint runs as a serverless function. NOTE: the local SQLite store does NOT
// persist on Vercel — bookings are delivered via WhatsApp (and email if a
// Resend key is set). For a persistent DB + /admin history, host on a Node server.
export default defineConfig({
  site: 'https://senadetailing.vercel.app',
  output: 'server',
  adapter: vercel(),
  vite: {
    plugins: [tailwindcss()],
  },
});
