<script setup lang="ts">
import type { ParameterEntity } from '~/types/entities'
import { AdminModalParameter } from '#components'

const { get, remove } = useParameterRepository()
const { open } = useModalStore()

const { data, refresh } = useAsyncData(() => get())

function callModal(preset?: ParameterEntity) {
  open(AdminModalParameter, {
    preset,
    onSubmit() { refresh() },
  })
}
</script>

<template>
  <div class="space-y-2">
    <UCard>
      <template #header>
        <div class="flex justify-between">
          <span class="text-2xl">Основні характеристики</span>
          <UButton icon="i-heroicons-folder-plus-16-solid" @click="callModal()">
            Додати характеристику
          </UButton>
        </div>
      </template>
      <UTable
        v-if="data"
        :rows="data"
        :columns="[
          {
            key: 'type',
            label: 'Тип',
          },
          {
            key: 'value',
            label: 'Значення',
          },
          {
            key: 'unit',
            label: 'Одиниці вимірювання',
          },
          {
            key: 'actions',
            label: 'Дії',
          },
        ]"
      >
        <template #type-data="{ row }">
          {{ row.type }}
        </template>
        <template #value-data="{ row }">
          {{ row.value }}
        </template>
        <template #unit-data="{ row }">
          {{ row.unit }}
        </template>
        <template #actions-data="{ row }">
          <UDropdown
            :items="[
              [
                {
                  label: 'Редагувати',
                  icon: 'i-heroicons-pencil-square-16-solid',
                  click: () => callModal(row),
                },
              ],
              [
                {
                  label: 'Видалити',
                  icon: 'i-heroicons-trash',
                  click: async () => {
                    await remove(row.id)
                    refresh()
                  },
                },
              ],
            ]"
          >
            <UButton color="gray" variant="ghost" icon="i-heroicons-adjustments-horizontal-solid" />
          </UDropdown>
        </template>
        <template #empty-state>
          <div class="flex flex-col items-center justify-center py-6 gap-3">
            <span class="italic text-sm">В базі відсутні характеристики</span>
            <UButton icon="i-heroicons-folder-plus-16-solid" @click="callModal()">
              Додати характеристику
            </UButton>
          </div>
        </template>
      </UTable>
    </UCard>
  </div>
</template>