<script setup lang="ts">
import { useRouteQuery } from '@vueuse/router'
import { AdminModalCategory } from '#components'
import type { CategoryEntity } from '~/types/entities'
import { VisibilityStatus } from '~/types/enums'

const { open } = useModalStore()

const { get, publish, draft, archive, remove } = useCategoryRepository()

const sQuery = useRouteQuery('statuses', '')

const { data: categories, refresh, status } = useAsyncData(
  () => get({ statuses: sQuery.value }),
  { watch: [sQuery] },
)

function callModal(preset?: CategoryEntity) {
  open(AdminModalCategory, {
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
        <span class="text-2xl">Категорії товарів</span>
        <UButton icon="i-heroicons-folder-plus-16-solid" @click="() => callModal()">
          Додати категорію
        </UButton>
      </div>
    </template>
    <div class="border-b pb-2 flex gap-2">
      <UFormGroup label="Статуси" class="w-40">
        <AdminStatusSelector query />
      </UFormGroup>
    </div>
    <UTable
      v-if="categories"
      :rows="categories"
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
          <ULink :to="`/admin/products?brands=${row.brand?.id}&categories=${row.id}`">
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
        <BaseImage :src="row.image" class="aspect-[1/1] object-contain w-20" />
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