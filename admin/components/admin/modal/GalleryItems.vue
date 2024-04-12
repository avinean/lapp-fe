<script lang="ts" setup>
import type { GalleryEntity } from '~/types/entities'

const props = defineProps<{
  files: File[]
}>()

const emit = defineEmits<{
  submit: []
}>()

defineExpose({
  title: 'Додати зображення до галереї',
  ui: { width: 'sm:max-w-4xl' },
})

const toast = useToast()
const { add } = useGalleryRepository()

const state = ref(
  props.files.map((file) => {
    const config: Partial<GalleryEntity> & { file: File, src: Ref<string>, added: boolean } = {
      title: undefined,
      file,
      src: ref(''),
      added: false,
    }

    const reader = new FileReader()
    reader.onload = (e: any) => {
      config.src.value = e.target.result
    }
    reader.readAsDataURL(file)

    return config
  }),
)

async function addGalleryItem(row: Partial<GalleryEntity> & { file: File, src: Ref<string>, added: boolean }) {
  const { photo, url, add: addPhoto } = usePhoto()
  photo.value = row.file
  await addPhoto()

  if (!url.value)
    return

  try {
    await add({
      title: row.title,
      image: url.value,
    })

    if (state.value.length === 1) { emit('submit') }
    else {
      state.value = state.value.map((item) => {
        if (item.title === row.title)
          return { ...item, added: true }

        return item
      })
    }
  }
  catch (error: any) {
    toast.add({
      title: 'Не вдалось додати фото',
      description: error.message,
    })
  }
}
</script>

<template>
  <UTable
    :rows="state" :columns="[
      { key: 'photo', label: 'Зображення' },
      { key: 'title', label: 'Назва' },
      { key: 'actions' },
    ]"
  >
    <template #photo-data="{ row }">
      <BaseImage :src="row.src" class="aspect-[1/1] object-contain w-24" />
    </template>
    <template #title-data="{ row }">
      <template v-if="row.added">
        {{ row.title }}
      </template>
      <UInput v-else v-model="row.title" />
    </template>
    <template #actions-data="{ row }">
      <UIcon v-if="row.added" name="i-heroicons-check-circle-16-solid" class="text-primary text-3xl" />
      <UButton
        v-else
        class="flex justify-center"
        :disabled="!row.title"
        @click="addGalleryItem(row)"
      >
        Завантажити
      </UButton>
    </template>
  </UTable>
</template>