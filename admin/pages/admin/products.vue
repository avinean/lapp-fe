<script setup lang="ts">
import { useRouteQuery } from '@vueuse/router'
import { AdminModalProduct } from '#components'
import type { ProductEntity } from '~/types/entities'
import { VisibilityStatus } from '~/types/enums'

const modalStore = useModalStore()

const bQuery = useRouteQuery('brands', '')
const cQuery = useRouteQuery('categories', '')
const sQuery = useRouteQuery('statuses', '')
const nameQuery = useRouteQuery('title', '')
const productTitle = ref(nameQuery.value)
const page = ref(1)
const take = ref(10)

watchDebounced(
  productTitle,
  () => nameQuery.value = productTitle.value,
  { debounce: 600, maxWait: 1000 },
)

const { get, publish, draft, archive, remove } = useProductRepository()
const { data, refresh, status } = useAsyncData(
  () => get({
    brands: bQuery.value,
    categoryIds: cQuery.value,
    statuses: sQuery.value,
    title: nameQuery.value,
    page: page.value,
    take: take.value,
  }),
  { watch: [bQuery, cQuery, sQuery, nameQuery, page, take] },
)

const items = computed(() => data.value?.items || [])
const pages = computed(() => data.value?.pages || 0)

watch([bQuery, cQuery, sQuery, nameQuery, take], () => {
  page.value = 1
})

function callModal(preset?: ProductEntity) {
  modalStore.open(AdminModalProduct, {
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
    key: 'price',
    label: 'Ціна',
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
        <span class="text-2xl">Товари</span>
        <UButton icon="i-heroicons-folder-plus-16-solid" @click="() => callModal()">
          Додати продукт
        </UButton>
      </div>
    </template>
    <div class="border-b pb-2 flex gap-2">
      <UFormGroup label="Статуси" class="w-40">
        <AdminStatusSelector query />
      </UFormGroup>
      <UFormGroup label="Категорії" class="w-50">
        <AdminCategorySelector query multiple />
      </UFormGroup>
      <UFormGroup label="Бренди" class="w-40">
        <AdminBrandSelector query multiple />
      </UFormGroup>
      <UFormGroup label="Назва" class="w-40">
        <UInput v-model="productTitle" />
      </UFormGroup>
    </div>
    <template v-if="data">
      <UTable

        :rows="items"
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
          <div class="max-w-32 overflow-hidden text-elipsis">
            {{ row.title }}
          </div>
        </template>
        <template #description-data="{ row }">
          <div class="max-w-32 overflow-hidden text-elipsis">
            {{ row.description }}
          </div>
        </template>
        <template #price-data="{ row }">
          <div class="max-w-32 overflow-hidden text-elipsis">
            {{ row.price }} грн
          </div>
        </template>
        <template #image-data="{ row }">
          <BaseImage :src="row.primaryImage?.image" class="aspect-[1/1] object-contain w-20" />
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
      <div class="flex gap-2 justify-end">
        <Adminlect v-model="take" :options="[10, 20, 50]" />
        <UPagination v-model="page" size="sm" :total="pages" :page-count="1" />
      </div>
    </template>
  </UCard>
</template>