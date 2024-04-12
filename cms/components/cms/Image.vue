<script lang="ts" setup>
import type { ImageSection } from '~/types/cms'

defineProps<ImageSection>()
</script>

<template>
  <BaseImage :src="image?.image" :alt="image?.title" :style="{ aspectRatio }" :fit />
</template>
