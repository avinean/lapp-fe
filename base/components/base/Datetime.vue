<script setup lang="ts">
const props = defineProps<{
  date?: Date | string
  dateStyle?: 'full' | 'long' | 'medium' | 'short'
  timeStyle?: 'full' | 'long' | 'medium' | 'short'
}>()

const formattedDate = computed(() => new Intl.DateTimeFormat('uk', {
  dateStyle: props.dateStyle,
  timeStyle: props.timeStyle,
}).format(props.date ? new Date(props.date) : new Date()))
</script>

<template>
  <span>{{ formattedDate }}</span>
</template>
