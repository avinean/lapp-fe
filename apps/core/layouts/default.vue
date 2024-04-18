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
    <div :ref="e => global.headerRef = e" class="shadow-md bg-white sticky top-0 z-10">
      <header class="container flex flex-wrap gap-4 items-center justify-between mx-auto p-2">
        <ULink to="/" class="h-24 w-24">
          <LLogo />
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
            <LNavigation />
          </nav>
        </transition>
      </header>
    </div>

    <div v-if="global.breadcrumbs?.length" class="container py-2 mx-auto">
      <UBreadcrumb
        divider="/"
        :links="[{ label: 'Головна', to: '/' }, ...global.breadcrumbs]"
      />
    </div>
    <main class="container flex-1 mx-auto">
      <NuxtPage />
    </main>

    <div class="bg-white">
      <div class="container flex flex-col items-center py-4 mx-auto">
        <ULink to="/" class="h-24 w-24 mx-auto">
          <LLogo />
        </ULink>
        <span>{{ yearString }}</span>
      </div>
    </div>
  </div>
</template>
