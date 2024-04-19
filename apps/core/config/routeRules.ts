import type { NuxtConfig } from 'nuxt/schema'

export default {
  '/mapi/**': {
    proxy: `${process.env.API_BASE_URL}/api/**`,
  },
  '/uploads/**': {
    proxy: `${process.env.API_BASE_URL}/uploads/**`,
  },
} satisfies NuxtConfig['routeRules']
