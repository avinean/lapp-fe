<script setup lang="ts">
import { AdminModalGalleryItems } from '#components'
import type { GalleryEntity } from '~/types/entities'

const props = defineProps<{
  multiple?: boolean
}>()
const model = defineModel<GalleryEntity[]>()

const { open } = useModalStore()
const { get } = useGalleryRepository()
const { data, refresh } = useAsyncData(() => get())
const dropZone = ref()
const { isOverDropZone } = useDropZone(dropZone, {
  onDrop: addFiles,
})

const selectedIds = computed(() => model.value?.map(i => i.id) || [])

function addFiles(files: File[] | null) {
  if (!files?.length)
    return

  open(AdminModalGalleryItems, {
    files,
    onSubmit() {
      refresh()
    },
  }, {
    onClose() {
      refresh()
    },
  })
}

function toggleSelect(item: GalleryEntity) {
  if (!props.multiple) {
    model.value = [item]
    return
  }
  if (!model.value)
    return
  const index = model.value.findIndex(i => i.id === item.id)

  if (index === -1)
    model.value.push(item)
  else
    model.value.splice(index, 1)
}
</script>

<template>
  <div>
    <UCard v-if="model?.length">
      <template #header>
        <span class="text-2xl">Обрані</span>
      </template>
      <div class="grid gap-2 grid-cols-4 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-14">
        <UCard
          v-for="item in model"
          :key="item.id"
        >
          <BaseImage :src="item.image" :alt="item.title" class="aspect-[1/1] object-contain" />
          <div class="text-xs truncate">
            {{ item.title }}
          </div>
        </UCard>
      </div>
    </UCard>
    <UCard>
      <template #header>
        <div class="flex justify-between">
          <span class="text-2xl">Галерея</span>
          <InputFile multiple @select="addFiles($event)">
            <UBadge icon="i-heroicons-folder-plus-16-solid cursor-pointer" size="md">
              Додати зображення
            </UBadge>
          </InputFile>
        </div>
      </template>
      <div class="relative">
        <div ref="dropZone" class="grid gap-2 grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7">
          <UCard
            v-for="item in data"
            :key="item.id"
            @click="toggleSelect(item)"
          >
            <UCheckbox
              v-if="model"
              :model-value="selectedIds"
              :value="item.id"
            />
            <BaseImage :src="item.image" :alt="item.title" class="aspect-[1/1] object-contain" />
            <div class="text-xs">
              {{ item.title }}
            </div>
          </UCard>
        </div>
        <div v-if="isOverDropZone" class="absolute inset-0 bg-green-400/30 border-2 border-dashed border-green-400 pointer-events-none" />
      </div>
    </UCard>
  </div>
</template>
