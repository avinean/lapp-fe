<script setup lang="ts">
import { useRouteParams } from '@vueuse/router'

const global = useGlobalStore()
const category = useRouteParams<string>('slug')

useBreadcrumbs(() => [
  {
    label: 'Продукція',
    to: '/products',
  },
  {
    label: global.categories?.find(_ => _.slug === category.value)?.title || '',
  },
])
</script>

<template>
  <UseProductList />
</template>
