import fs from 'node:fs'

const allowedLayers = ['core', ...(process.env.MODULES?.split(',') || [])]
const layers = fs.readdirSync('./apps').filter(layer => !allowedLayers.includes(layer))

export default defineNuxtConfig({
  typescript: {
    typeCheck: true,
    tsConfig: {
      exclude: [
        ...layers.map(layer => `../apps/${layer}/**/*`),
      ],
    },
  },
  devtools: { enabled: true },
  extends: [
    ...(allowedLayers).map(layer => `./apps/${layer}`).reverse(),
  ],
})
