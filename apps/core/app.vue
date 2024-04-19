<script setup lang="ts">
if (process.client)
  localStorage.removeItem('nuxt-color-mode')

$fetch('/api/test')
</script>

<template>
  <NuxtLayout />
  <ClientOnly>
    <UNotifications />
    <UseModal />
  </ClientOnly>
</template>

<style>
h1 {
    @apply text-4xl font-bold;
}
h2 {
    @apply text-3xl font-bold;
}
h3 {
    @apply text-2xl font-bold;
}
h4 {
    @apply text-xl font-bold;
}
h5 {
    @apply text-lg font-bold;
}
h6 {
    @apply text-base font-bold;
}
p {
    @apply text-base;
}
ul.list {
    @apply list-disc pl-5 mb-4 space-y-2;
}
a.link {
    @apply text-gray-500 hover:text-gray-600 underline;
}
</style>
