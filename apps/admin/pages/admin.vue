<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'requires-auth',
})

const { adminNavigation } = useAppConfig()
</script>

<template>
  <div>
    <UHorizontalNavigation
      :links="adminNavigation"
      class="border-b border-gray-200 dark:border-gray-800"
    />
    <NuxtPage />
  </div>
</template>
