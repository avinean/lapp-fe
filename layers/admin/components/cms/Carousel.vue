<script setup lang="ts">
import type { CarouselSection } from '~/types/cms'

const props = defineProps<Partial<CarouselSection>>()
// basis-full basis-1/2 basis-1/3 basis-1/4 basis-1/5 basis-1/6
// md:basis-full md:basis-1/2 md:basis-1/3 md:basis-1/4 md:basis-1/5 md:basis-1/6
// lg:basis-full lg:basis-1/2 lg:basis-1/3 lg:basis-1/4 lg:basis-1/5 lg:basis-1/6
// xl:basis-full xl:basis-1/2 xl:basis-1/3 xl:basis-1/4 xl:basis-1/5 xl:basis-1/6

const classes = computed(() => [
  'flex flex-none snap-center justify-center',
  ...Object.entries(props.columns!).map(([breakpoint, cols]) =>
  `${breakpoint === 'sm' ? '' : `${breakpoint}:`}basis-${cols < 2 ? 'full' : `1/${cols}`}`,
  ),
])

const carouselRef = ref()

onMounted(() => {
  if (!props.autoplay)
    return
  setInterval(() => {
    if (!carouselRef.value)
      return

    if (carouselRef.value.page === carouselRef.value.pages)
      return carouselRef.value.select(0)

    carouselRef.value.next()
  }, props.duration)
})
</script>

<template>
  <UCarousel
    ref="carouselRef"
    v-slot="{ item }"
    :items="groups"
    :ui="{ item: classes }"
    :arrows
  >
    <CmsSection :content="item" />
  </UCarousel>
</template>
