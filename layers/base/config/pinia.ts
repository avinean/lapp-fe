import type { NuxtConfig } from 'nuxt/schema'

export default {
  storesDirs: ['./layers/base/stores/**'],
} satisfies NuxtConfig['pinia']
