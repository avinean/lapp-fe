<script setup lang="ts">
if (process.client)
  localStorage.removeItem('nuxt-color-mode')
</script>

<template>
  <NuxtLayout />
</template>

<style>
h1 {
    @apply text-4xl font-bold mb-4;
}
h2 {
    @apply text-3xl font-bold mb-4;
}
h3 {
    @apply text-2xl font-bold mb-4;
}
h4 {
    @apply text-xl font-bold mb-4;
}
h5 {
    @apply text-lg font-bold mb-4;
}
h6 {
    @apply text-base font-bold mb-4;
}
p {
    @apply text-base mb-4;
}
ul.list {
    @apply list-disc pl-5 mb-4 space-y-2;
}
a.link {
    @apply text-gray-500 hover:text-gray-600 underline;
}
</style>
