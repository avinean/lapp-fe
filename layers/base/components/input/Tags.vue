<script setup lang="ts">
const model = defineModel<string>({ default: '' })
const value = ref('')

function add() {
  const v = value.value.trim()
  if (!v || model.value.includes(v))
    return value.value = ''

  model.value = [...model.value.split(',').filter(Boolean), v].join(',')
  value.value = ''
}

function remove(item: string) {
  model.value = model.value.split(',').filter(i => i !== item).join(',')
}
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <UButtonGroup
      size="sm"
      orientation="horizontal"
      class="min-w-full"
    >
      <UInput
        v-model="value"
        class="w-full"
        @keypress.space="add"
        @change="add"
      />
    </UButtonGroup>
    <template v-if="model">
    <UBadge
      v-for="item in model.split(',')"
      :key="item"
      variant="subtle"
      class="cursor-pointer"
      @click="remove(item)"
    >
      {{ item }}
      <UIcon name="i-heroicons-x-mark-16-solid" />
    </UBadge>
    </template>
  </div>
</template>
