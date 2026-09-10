// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      title: 'Jisu Lee — Senior Full Stack & Software Engineer',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Professional CV and Portfolio of Jisu Lee, Senior Full Stack & Software Engineer specializing in Vue, Nuxt, TypeScript, Node.js, and Cloud Architecture.' },
        { name: 'theme-color', content: '#0a0d14' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }
      ]
    }
  }
})
