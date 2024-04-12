<script setup lang="ts">
import { AdminModalColor } from '#components'

const colorRepository = useColorRepository()
const { open } = useModalStore()

const { data: colors, refresh: refreshColors } = useAsyncData(() => colorRepository.get())

function addColor() {
  open(AdminModalColor, {
    onSubmit() { refreshColors() },
  })
}
</script>

<template>
  <div class="space-y-2">
    <UCard>
      <template #header>
        <div class="flex justify-between">
          <span class="text-2xl">Кольори</span>
          <UButton icon="i-heroicons-folder-plus-16-solid" @click="addColor">
            Додати колір
          </UButton>
        </div>
      </template>

      <UTable
        v-if="colors"
        :rows="colors"
        :columns="[
          {
            key: 'title',
            label: 'Назва',
          },
          {
            key: 'value',
            label: 'Колір',
          },
          {
            key: 'image',
            label: 'Зображення',
          },
        ]"
      >
        <template #title-data="{ row }">
          {{ row.title }}
        </template>
        <template #value-data="{ row }">
          <div class="w-10 h-10" :style="{ background: row.value }" />
        </template>
        <template #image-data="{ row }">
          <BaseImage :src="row.image" class="w-10 h-10" />
        </template>
        <template #empty-state>
          <div class="flex flex-col items-center justify-center py-6 gap-3">
            <span class="italic text-sm">В базі відсутні кольори</span>
            <UButton icon="i-heroicons-folder-plus-16-solid" @click="addColor">
              Додати колір
            </UButton>
          </div>
        </template>
      </UTable>
    </UCard>
  </div>
</template>
