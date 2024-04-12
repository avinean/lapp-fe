<script setup lang="ts">
import { useRouteQuery } from '@vueuse/router'
import { AdminModalBrand } from '#components'
import type { BrandEntity } from '~/types/entities'
import { VisibilityStatus } from '~/types/enums'

const modalStore = useModalStore()

const sQuery = useRouteQuery('statuses', '')

const { get, publish, draft, archive, remove } = useBrandRepository()
const { data, refresh, status } = await useAsyncData(
  () => get({ statuses: sQuery.value }),
  { watch: [sQuery] },
)

function callModal(preset?: BrandEntity) {
  modalStore.open(AdminModalBrand, {
    preset,
    onSubmit() { refresh() },
  })
}

const columns = [
  {
    key: 'status',
    label: 'Статус',
  },
  {
    key: 'title',
    label: 'Назва',
  },
  {
    key: 'description',
    label: 'Опис',
  },
  {
    key: 'image',
    label: 'Зображення',
  },
  {
    key: 'createdAt',
    label: 'Створено',
  },
  {
    key: 'updatedAt',
    label: 'Оновлено',
  },
  {
    key: 'actions',
    label: 'Дії',
  },
]
</script>

<template>
  <UCard>
    <template #header>
      <div class="flex justify-between">
        <span class="text-2xl">Бренди</span>
        <UButton icon="i-heroicons-folder-plus-16-solid" @click="() => callModal()">
          Додати бренд
        </UButton>
      </div>
    </template>
    <div class="border-b pb-2">
      <UFormGroup label="Статуси" class="w-40">
        <AdminStatusSelector query />
      </UFormGroup>
    </div>
    <UTable
      :rows="data || []"
      :columns="columns"
      :loading="status === 'pending'"
      :loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'Loading...' }"
    >
      <template #status-data="{ row }">
        <UBadge v-if="row.status === VisibilityStatus.Draft" variant="subtle" color="gray">
          Чорновик
        </UBadge>
        <UBadge v-else-if="row.status === VisibilityStatus.Archived" color="black">
          Архівовано
        </UBadge>
        <UBadge v-else variant="subtle" color="green">
          Опублікований
        </UBadge>
      </template>
      <template #title-data="{ row }">
        <UTooltip text="Перейти на сторінку товарів категорії">
          <ULink :to="`/admin/categories?brands=${row.id}`">
            {{ row.title }}
          </ULink>
        </UTooltip>
      </template>
      <template #description-data="{ row }">
        <div class="max-w-32 overflow-hidden text-elipsis">
          {{ row.description }}
        </div>
      </template>
      <template #image-data="{ row }">
        <BaseImage :src="row.image" class="aspect-[1/1] object-contain w-20"/>
      </template>
      <template #createdAt-data="{ row }">
        <div class="max-w-32 overflow-hidden text-elipsis">
          <base-datetime :date="row.createdAt" />
        </div>
      </template>
      <template #updatedAt-data="{ row }">
        <div class="max-w-32 overflow-hidden text-elipsis">
          <base-datetime :date="row.updatedAt" />
        </div>
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
              {
                label: row.status === VisibilityStatus.Draft ? 'Опублікувати' : 'Приховати',
                icon: row.status === VisibilityStatus.Draft ? 'i-heroicons-eye-solid' : 'i-heroicons-eye-slash-solid',
                click: async () => {
                  await (row.status === VisibilityStatus.Draft ? publish(row.id) : draft(row.id))
                  refresh()
                },
              },
            ],
            [
              {
                label: row.status === VisibilityStatus.Archived ? 'Розархівувати' : 'Архівувати',
                icon: row.status === VisibilityStatus.Archived ? 'i-heroicons-folder-plus-16-solid' : 'i-heroicons-folder-minus-16-solid',
                click: async () => {
                  await (row.status === VisibilityStatus.Archived ? draft(row.id) : archive(row.id))
                  refresh()
                },
              },
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
    </UTable>
  </UCard>
</template>