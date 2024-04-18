<script setup lang="ts">
import type { ButtonSize } from '#ui/types'

defineProps<{
  size?: ButtonSize
  orientation?: 'horizontal' | 'vertical'
  items: {
    icon: string
    label?: string
    tooltip?: string
    onClick?: () => void
  }[]
}>()
</script>

<template>
  <UButtonGroup
    :size="size || 'sm'"
    :orientation="orientation"
  >
    <template
      v-for="(item, key) in items"
      :key
    >
      <UTooltip
        v-if="item.tooltip"
        :text="item.tooltip"
      >
        <UButton v-bind="item" />
      </UTooltip>
      <UButton
        v-else
        v-bind="item"
      />
    </template>
  </UButtonGroup>
</template>
