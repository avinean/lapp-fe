<script setup lang="ts">
import { useRouteQuery } from '@vueuse/router'

const props = defineProps<{
  multiple?: boolean
  disabled?: boolean
  query?: boolean
}>()
const _model = defineModel<number[] | number>()
const brandRepository = useBrandRepository()
const { data } = useAsyncData(() => brandRepository.get())

const brands = useRouteQuery<string>('brands')

const selectedBrands = computed({
  get() {
    return (brands.value?.toString()?.split(',').filter(Boolean).map(Number) as number[]) || []
  },
  set(_brands: number[]) {
    brands.value = _brands.join(',')
  },
})

const model = computed({
  get() {
    return props.query ? selectedBrands.value : _model.value!
  },
  set(c: number[] | number) {
    (props.query ? selectedBrands : _model).value = c
  },
})
</script>

<template>
  <USelectMenu
    v-model="model"
    :options="data || []"
    :multiple="multiple"
    :disabled="disabled"
    value-attribute="id"
    option-attribute="title"
    placeholder="Обрати бренд"
  />
</template>
