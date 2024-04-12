<script setup lang="ts">
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'

const global = useGlobalStore()
const { md } = useBreakpoints(breakpointsTailwind)
const menuOpen = ref(!!md.value)

onMounted(() => {
  global.checkLogin()
})

const startYear = 2024
const currentYear = new Date().getFullYear()
const yearString = startYear === currentYear ? currentYear : `${startYear}-${currentYear}`
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <div :ref="e => global.headerRef = e" class="border-b bg-white sticky top-0 z-10">
      <div v-if="global.isLoggedIn" class="flex items-center md:justify-between p-2 bg-gray-300">
        <ULink to="/admin" class="flex items-center gap-2">
          <i class="i-heroicons-arrow-left-on-rectangle-20-solid text-2xl text-gray" />
          Перейти до адмін панелі
        </ULink>
        <div class="flex items-center gap-2">
          Режим попереднього перегляду <UToggle v-model="global.isPreview" color="primary" />
        </div>
      </div>
      <header class="container flex flex-wrap gap-4 items-center justify-between mx-auto p-2">
        <ULink to="/" class="h-24 w-24">
          <CmsSection slug="logo" />
        </ULink>

        <button class="flex md:hidden" @click="menuOpen = !menuOpen">
          <i v-if="menuOpen" class="i-heroicons-x-mark-16-solid text-4xl text-gray" />
          <i v-else class="i-heroicons-bars-3-16-solid text-4xl text-gray" />
        </button>

        <transition name="fade">
          <nav
            v-if="md || menuOpen"
            class="flex"
            :class="{ 'w-full flex-col items-center': !md }"
            @click="menuOpen = !menuOpen"
          >
            <CmsSection key="menyu" slug="menyu" />
          </nav>
        </transition>
      </header>
    </div>

    <div class="container py-2 mx-auto">
      <UBreadcrumb
        v-if="global.breadcrumbs?.length"
        divider="/"
        :links="[{ label: 'Головна', to: '/' }, ...global.breadcrumbs]"
      />
    </div>
    <main class="container flex-1 mx-auto">
      <NuxtPage />
      <div class="fixed bottom-12 right-5 animate-bounce bg-white border">
        <UseCall v-slot="{ call }">
          <button @click="call">
            <i class="i-heroicons-phone text-6xl text-gray" />
          </button>
        </UseCall>
      </div>
    </main>

    <div class="border-t bg-white">
      <div class="container flex flex-col items-center py-4 mx-auto">
        <ULink to="/" class="h-24 w-24 mx-auto">
          <CmsSection slug="logo" />
        </ULink>
        <span>{{ yearString }}</span>
      </div>
    </div>
  </div>
</template>
