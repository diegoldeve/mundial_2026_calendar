// GITHUB_REPOSITORY = "owner/repo" in CI — use the repo name as the base URL for GitHub Pages
const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1]
const baseURL = repoName ? `/${repoName}/` : '/'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  tailwindcss: {
    cssPath: '~/assets/css/main.css',
  },
  app: {
    baseURL,
    head: {
      title: 'Mundial 2026',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Partidos y resultados del Mundial 2026' },
      ],
    },
  },
})
