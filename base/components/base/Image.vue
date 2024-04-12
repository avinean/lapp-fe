<script setup lang="ts">
withDefaults(defineProps<{
  src?: string
  alt?: string
  fit?: 'cover' | 'contain'
}>(), {
  fit: 'cover',
})
</script>

<template>
  <picture class="block">
    <img
      :src="src || '/placeholder.jpg'"
      loading="lazy"
      :alt
      class="w-full h-full"
      :class="{
        'object-cover': fit === 'cover',
        'object-contain': fit === 'contain',
      }"
    >
  </picture>
</template>
