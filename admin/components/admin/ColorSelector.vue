<script setup lang="ts">
defineProps<{
  multiple?: boolean
  disabled?: boolean
}>()
const model = defineModel<number[] | number>()
const { get } = useColorRepository()
const { data } = useAsyncData(get)

const selectedColors = computed(() => {
  return (data.value || []).filter(color => [model.value].flat().includes(color.id))
})

defineExpose({
  selectedColors,
})
</script>

<template>
  <div>
    <USelectMenu
      v-model="model"
      :options="data || []"
      :multiple="multiple"
      :disabled="disabled"
      value-attribute="id"
      option-attribute="title"
      placeholder="Обрати колір"
      class="w-full"
    >
      <template #option="{ option }">
        <span
          v-if="option.value"
          class="flex-shrink-0 w-8 h-8 mt-px rounded-full"
          :style="{ background: option.value }"
        />
        <BaseImage
          v-else
          :src="option.image"
          class="w-8 h-8 mt-px rounded-full"
        />
        <span class="truncate">{{ option.title }}</span>
      </template>
    </USelectMenu>
    <slot :colors="selectedColors" />
  </div>
</template>
