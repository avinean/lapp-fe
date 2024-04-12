<script setup lang="ts">
import { useRouteParams, useRouteQuery } from '@vueuse/router'
import type { PaginationResponse } from '~/types/api'
import type { ProductEntity } from '~/types/entities'
import type { AccordionItem } from '#ui/types'

const global = useGlobalStore()
const { getByPage, getFilters } = useProductRepository()

const filtersOpen = ref(false)
const headerRef = computed(() => global.headerRef)
const loadMoreRef = ref()
// @ts-expect-error it's a ref
const { height } = useElementSize(headerRef)
const loadMoreVisible = useElementVisibility(loadMoreRef)
const _category = useRouteParams<string>('slug')
const _brands = useRouteQuery<string>('b')
const _categories = useRouteQuery<string>('c')
const _colors = useRouteQuery<string>('colors')
const _parameters = useRouteQuery<string>('parameters')

const brands = computed({
  get() {
    return _brands.value?.split(',').filter(Boolean) || []
  },
  set(value: string[]) {
    _brands.value = value.join(',')
  },
})

const categories = computed({
  get() {
    if (_category.value)
      return [_category.value]

    return _categories.value?.split(',').filter(Boolean) || []
  },
  set(value: string[]) {
    _categories.value = value.join(',')
  },
})

const colors = computed({
  get() {
    return _colors.value?.split(',').filter(Boolean) || []
  },
  set(value: string[]) {
    _colors.value = value.join(',')
  },
})

const parameters = computed({
  get() {
    return _parameters.value?.split(',').filter(Boolean) || []
  },
  set(value: string[]) {
    _parameters.value = value.join(',')
  },
})

function toggleParameter(slug: string) {
  if (parameters.value.includes(slug))
    parameters.value = parameters.value.filter(_ => _ !== slug)
  else
    parameters.value = [...parameters.value, slug]
}

const brandRepository = useBrandRepository()
const { data: awailableBrands } = useAsyncData(
  () => brandRepository.get({ statuses: global.statuses.join(','), categories: categories.value.join(',') }),
  { watch: [() => global.statuses, _category, _categories] },
)

const page = ref(1)
const take = ref(24)

const { data, refresh, pending } = useAsyncData(
  () => getByPage({
    statuses: global.statuses,
    brands: brands.value.length ? brands.value : undefined,
    categories: categories.value.length ? categories.value : undefined,
    colors: colors.value.length ? colors.value : undefined,
    parameters: parameters.value.length ? parameters.value : undefined,
    page: page.value,
    take: take.value,
  }),
  {
    watch: [() => global.statuses, page],
    transform({ items, pages }: PaginationResponse<ProductEntity>): PaginationResponse<ProductEntity> {
      return {
        items: page.value === 1 ? items : [...(data.value?.items || []), ...items],
        pages,
      } satisfies PaginationResponse<ProductEntity>
    },
  },
)

watch([_brands, _categories, _colors, _parameters], () => {
  page.value = 1
  refresh()
})

const { data: filters } = useAsyncData(
  () => getFilters({ categories: categories.value.length ? categories.value : undefined }),
  {
    watch: [() => global.statuses],
  },
)

const hasMore = computed(() => {
  const max = (data.value?.pages || 1) * take.value
  const current = page.value * take.value
  return current < max
})

whenever(loadMoreVisible, () => {
  if (!hasMore.value)
    return
  page.value++
})

const filterSections = computed(() => [
  awailableBrands.value?.length && {
    label: 'Виробники',
    slot: 'slot-brands',
    defaultOpen: true,
  },
  !_category.value && {
    label: 'Категорії',
    slot: 'slot-categories',
    defaultOpen: true,
  },
  filters.value?.colors && {
    label: 'Кольори',
    slot: 'slot-colors',
    defaultOpen: true,
  },
  ...(filters.value?.parameters || [])?.map(({ label }, i) => ({ label, slot: `slot-${i}` })),
].filter(Boolean) as AccordionItem[])

const [DefineTemplate, ReuseTemplate] = createReusableTemplate()
</script>

<template>
  <div class="flex flex-col md:flex-row gap-2 py-2">
    <DefineTemplate>
      <UCard>
        <div class="divide-y">
          <div class="text-xl font-bold mb-2">
            Фільтри
          </div>
          <UAccordion
            multiple
            :items="filterSections"
          >
            <template #slot-brands>
              <div class="space-y-2">
                <UCheckbox
                  v-for="brand in awailableBrands"
                  :key="brand.slug"
                  v-model="brands"
                  :label="brand.title"
                  :value="brand.slug"
                  name="brands"
                />
              </div>
            </template>
            <template #slot-categories>
              <div class="space-y-2">
                <UCheckbox
                  v-for="category in global.categories"
                  :key="category.slug"
                  v-model="categories"
                  :label="category.title"
                  :value="category.slug"
                  name="categories"
                />
              </div>
            </template>
            <template #slot-colors>
              <UseColorList
                v-model="colors"
                :colors="filters?.colors"
                multiple
                exclude-mix
              />
            </template>
            <template
              v-for="i in filters?.parameters.length"
              :key="i"
              #[`slot-${i-1}`]
            >
              <div class="flex flex-wrap gap-2 py-2">
                <UBadge
                  v-for="parameter in filters?.parameters[i - 1].items"
                  :key="parameter.id"
                  :label="[parameter.value, parameter.unit].filter(Boolean).join(' ')"
                  :color="parameters.includes(parameter.slug) ? undefined : 'gray'"
                  class="cursor-pointer"
                  @click="toggleParameter(parameter.slug)"
                />
              </div>
            </template>
          </UAccordion>
        </div>
      </UCard>
    </DefineTemplate>
    <div class="w-60 min-w-60 hidden md:block">
      <div
        class="sticky top-0 z-1 overflow-auto"
        :style="{
          top: `calc(${height}px + 0.5rem)`,
          maxHeight: `calc(100vh - ${height}px - 1rem)`,
        }"
      >
        <ReuseTemplate />
      </div>
    </div>
    <div
      class="sticky top-0 z-1 w-full flex items-center justify-between p-2 md:hidden bg-white border"
      :style="{ top: `calc(${height}px + 0.5rem)` }"
    >
      <span>Фільтри</span>
      <button class="flex md:hidden" @click="filtersOpen = true">
        <i class="i-heroicons-adjustments-horizontal text-4xl text-gray" />
      </button>
    </div>
    <UModal v-model="filtersOpen" fullscreen>
      <ReuseTemplate />
      <div class="flex justify-center p-2 mt-auto">
        <UButton @click="filtersOpen = false">
          Застосувати
        </UButton>
      </div>
    </UModal>
    <div class="flex-1">
      <div v-if="data?.items && !data.items.length" class="h-full border-b">
        <div class="text-center text-xl font-bold">
          Немає результатів
        </div>
      </div>
      <ul v-if="data?.items" class="grid gap-2 sm:grid-cols-2 md:col-span-2 lg:grid-cols-3 lg:col-span-3 xl:grid-cols-4">
        <ULink
          v-for="product in data.items"
          :key="product.id"
          :to="`/p/${product.slug}`"
        >
          <UCard class="h-full">
            <BaseImage
              :src="product.primaryImage?.image"
              :alt="product.primaryImage?.title"
              class="object-cover w-full aspect-[1/1]"
            />
            <div class="border-b-1 font-bold">
              {{ product.title }}
            </div>
            <span class="sr-only">
              Детальніше про {{ product.title }}
            </span>
          </UCard>
        </ULink>
        <template v-if="page > 1 && pending">
          <USkeleton v-for="key in take" :key />
        </template>
      </ul>
      <div ref="loadMoreRef" class="relative -top-20" />
    </div>
  </div>
</template>
