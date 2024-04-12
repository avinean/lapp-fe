<script lang="ts" setup>
const route = useRoute()
const slug = ref(route.params.slug.toString())
</script>

<template>
  <div>
    <CmsSection :key="slug" :slug="slug" />
  </div>
</template>
