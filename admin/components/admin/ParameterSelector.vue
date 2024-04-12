<script setup lang="ts">
defineProps<{
  multiple?: boolean
  disabled?: boolean
}>()
const model = defineModel<number[] | number>()
const { get } = useParameterRepository()
const { data } = useAsyncData(get)

const selectedParameters = computed(() => {
  return (data.value || []).filter(color => [model.value].flat().includes(color.id))
})

defineExpose({
  selectedParameters,
})
</script>

<template>
  <div>
    <USelectMenu
      v-model="model"
      :options="data || []"
      :multiple="multiple"
      :disabled="disabled"
      searchable
      :search-attributes="['type', 'value', 'unit']"
      value-attribute="id"
      placeholder="Обрати характеристику"
      class="w-full"
    >
      <template #option="{ option }">
        {{ option.type }}: {{ option.value }} {{ option.unit }}
      </template>
    </USelectMenu>
    <slot :parameters="selectedParameters" />
  </div>
</template>
