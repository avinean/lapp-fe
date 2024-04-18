import modules from './config/modules'
import runtimeConfig from './config/runtimeConfig'
import pinia from './config/pinia'
import routeRules from './config/routeRules'
import css from './config/css'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  colorMode: {
    preference: 'light',
    fallback: 'light',
    hid: 'nuxt-color-mode-script',
    globalName: '__NUXT_COLOR_MODE__',
    componentName: 'ColorScheme',
    classPrefix: '',
    classSuffix: '-mode',
    storageKey: 'nuxt-color-mode',
  },
  css,
  modules,
  runtimeConfig,
  pinia,
  routeRules,
})
