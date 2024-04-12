<script lang="ts" setup>
const route = useRoute()
console.log(route.params)
const slug = ref(route.params.slug.toString() || 'index')
</script>

<template>
  <div>
    <CmsSection :key="slug" :slug="slug" />
  </div>
</template>
