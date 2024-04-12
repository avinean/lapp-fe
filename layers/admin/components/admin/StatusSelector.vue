<script lang="ts" setup>
import { useRouteQuery } from '@vueuse/router'
import { VisibilityStatus } from '~/types/enums'

const props = defineProps<{
  query?: boolean
}>()

const statuses = useRouteQuery<string>('statuses')
const _model = defineModel<VisibilityStatus[]>({
  default: () => [],
})

const selectedStatuses = computed({
  get() {
    return (statuses.value?.toString()?.split(',') as VisibilityStatus[]) || []
  },
  set(_statuses: VisibilityStatus[]) {
    statuses.value = _statuses.join(',')
  },
})

const model = computed({
  get() {
    return props.query ? selectedStatuses.value : _model.value
  },
  set(statuses: VisibilityStatus[]) {
    (props.query ? selectedStatuses : _model).value = statuses
  },
})

const options = [
  {
    id: VisibilityStatus.Published,
    label: 'Опублікований',
    icon: 'i-heroicons-eye-solid',
  },
  {
    id: VisibilityStatus.Draft,
    label: 'Чорновик',
    icon: 'i-heroicons-eye-slash-solid',
  },
  {
    id: VisibilityStatus.Archived,
    label: 'Архівований',
    icon: 'i-heroicons-folder-minus-16-solid',
  },
]
</script>

<template>
  <USelectMenu
    v-model="model"
    :options="options"
    option-attribute="label"
    value-attribute="id"
    multiple
    placeholder="Обрати статуси"
  />
</template>