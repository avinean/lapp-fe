<script setup lang="ts">
import type { GridSection } from '~/types/cms'

const props = defineProps<Partial<GridSection>>()
// sm:grid-cols-1 sm:grid-cols-2 sm:grid-cols-3 sm:grid-cols-4 sm:grid-cols-5 sm:grid-cols-6
// md:grid-cols-1 md:grid-cols-2 md:grid-cols-3 md:grid-cols-4 md:grid-cols-5 md:grid-cols-6
// lg:grid-cols-1 lg:grid-cols-2 lg:grid-cols-3 lg:grid-cols-4 lg:grid-cols-5 lg:grid-cols-6
// xl:grid-cols-1 xl:grid-cols-2 xl:grid-cols-3 xl:grid-cols-4 xl:grid-cols-5 xl:grid-cols-6

const classes = computed(() => Object.entries(props.columns!).map(([breakpoint, cols]) => `${breakpoint}:grid-cols-${cols}`))
</script>

<template>
  <div
    class="grid gap-2"
    :class="classes"
  >
    <slot />
  </div>
</template>
