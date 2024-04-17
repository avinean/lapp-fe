<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'requires-auth',
})
</script>

<template>
  <div>
    <UHorizontalNavigation
      :links="[
        {
          label: 'Галерея',
          to: `/admin/gallery`,
        },
        {
          label: 'Контакти',
          to: `/admin/contacts`,
        },
        {
          label: 'Сторінки',
          to: '/admin/pages',
        },
        {
          label: 'CMS',
          to: '/admin/cms',
        },
      ]"
      class="border-b border-gray-200 dark:border-gray-800"
    />
    <NuxtPage />
  </div>
</template>
