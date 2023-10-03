// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: {
    enabled: true,

    timeline: {
      enabled: true
    }
  },
  pages: true,
  plugins: [
    { src: '~/plugins/socket.js', ssr: false }
  ],
  routeRules: {
    "/room/*": {ssr: false}
  }
})