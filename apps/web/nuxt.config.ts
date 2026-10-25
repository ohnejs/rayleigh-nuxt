import { themeScript } from './app/utils/theme';

export default defineNuxtConfig({
  compatibilityDate: '2026-10-01',
  // `@ohnejs/nuxt` reads each page from the CMS, fills the `<head>` and joins the live preview.
  // See https://ohne.dev/docs/cms/frameworks#nuxt
  modules: ['@ohnejs/nuxt'],
  // Your API in development. `NUXT_OHNE_API` replaces it when the server starts.
  ohne: { api: 'http://localhost:9001' },
  css: ['~/assets/styles/site.css'],
  app: {
    head: {
      // The title of a page that has none of its own, like the error page.
      // A page from the CMS gets its own title, like "About | Rayleigh".
      title: 'Rayleigh',
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        // The fonts of the body text and the headings start loading before the stylesheet asks for them.
        {
          rel: 'preload',
          href: '/fonts/lato-400.woff2',
          as: 'font',
          type: 'font/woff2',
          crossorigin: '',
        },
        {
          rel: 'preload',
          href: '/fonts/poppins-500.woff2',
          as: 'font',
          type: 'font/woff2',
          crossorigin: '',
        },
      ],
      // Picks the light or dark theme while the page loads, before anything shows.
      script: [{ innerHTML: themeScript }],
    },
  },
});
