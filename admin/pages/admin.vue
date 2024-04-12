<script setup lang="ts">
import { VisibilityStatus } from '~/types/enums'

definePageMeta({
  layout: 'admin',
  redirect: '/admin/products',
  middleware: 'requires-auth',
})

const query = `?statuses=${[
  VisibilityStatus.Published,
  VisibilityStatus.Draft,
].join(',')}`
</script>

<template>
  <div>
    <UHorizontalNavigation
      :links="[
        {
          label: 'Продукти',
          to: `/admin/products${query}`,
        },
        {
          label: 'Категорії продуктів',
          to: `/admin/categories${query}`,
        },
        {
          label: 'Бренди',
          to: `/admin/brands${query}`,
        },
        {
          label: 'Галерея',
          to: `/admin/gallery`,
        },
        {
          label: 'Кольори',
          to: '/admin/colors',
        },
        {
          label: 'Характеристики',
          to: '/admin/parameters',
        },
        {
          label: 'Застосування',
          to: '/admin/applications',
        },
        {
          label: 'Контакти',
          to: `/admin/contacts${query}`,
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
