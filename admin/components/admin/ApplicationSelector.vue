<script setup lang="ts">
defineProps<{
  multiple?: boolean
  disabled?: boolean
}>()
const model = defineModel<number[]  | number>()
const { get } = useApplicationRepository()
const { data } = useAsyncData(get)
</script>

<template>
  <USelectMenu
    v-model="model"
    :options="data || []"
    :multiple="multiple"
    :disabled="disabled"
    value-attribute="id"
    option-attribute="title"
    placeholder="Обрати вид застосування"
  />
</template>
