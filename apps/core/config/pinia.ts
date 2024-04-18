import type { NuxtConfig } from 'nuxt/schema'

export default {
  storesDirs: ['./apps/core/stores/**'],
} satisfies NuxtConfig['pinia']
