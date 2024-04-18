import type { NuxtConfig } from 'nuxt/schema'

export default [
  '@nuxt/ui',
  '@pinia/nuxt',
  '@vueuse/nuxt',
  '@nuxtjs/color-mode',
  '@nuxt/image',
] satisfies NuxtConfig['modules']
