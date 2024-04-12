<script setup lang="ts">
import { useRouteQuery } from '@vueuse/router'

const props = defineProps<{
  multiple?: boolean
  disabled?: boolean
  query?: boolean
}>()
const _model = defineModel<number[] | number>()
const { get } = useCategoryRepository()
const { data } = useAsyncData(() => get({}))

const categories = useRouteQuery<string>('categories')

const selectedCategories = computed({
  get() {
    return (categories.value?.toString()?.split(',').filter(Boolean).map(Number) as number[]) || []
  },
  set(_categories: number[]) {
    categories.value = _categories.join(',')
  },
})

const model = computed({
  get() {
    return props.query ? selectedCategories.value : _model.value!
  },
  set(c: number[] | number) {
    (props.query ? selectedCategories : _model).value = c
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
    placeholder="Обрати категорію"
  >
    <template v-if="multiple" #label>
      <span v-if="Array.isArray(model) && model?.length" class="truncate">Обрано {{ model.length }}</span>
      <span v-else>Обрати категорію</span>
    </template>
  </USelectMenu>
</template>
