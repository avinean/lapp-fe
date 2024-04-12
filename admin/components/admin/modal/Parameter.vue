<script lang="ts" setup>
import type { ParameterEntity } from '~/types/entities'

const props = defineProps<{
  preset?: ParameterEntity
}>()

const emit = defineEmits<{
  submit: []
}>()

defineExpose({
  title: 'Додати характеристику',
})

const toast = useToast()
const { add, edit, suggestions } = useParameterRepository()
const { data } = useAsyncData(suggestions)

const loading = ref(false)
const state: Partial<ParameterEntity> = reactive({
  type: props.preset?.type.trim() || undefined,
  value: props.preset?.value?.trim() || undefined,
  unit: props.preset?.unit?.trim() || undefined,
})

const types = computed(() => data.value?.map(item => item.type) || [])
const units = computed(() => {
  if (!state.type)
    return [...new Set(data.value?.flatMap(item => item.units.map(({ unit }) => unit)))]
  return data.value?.find(item => item.type === state.type)?.units?.map(({ unit }) => unit) || []
})
const values = computed(() => {
  if (!state.unit)
    return [...new Set(data.value?.flatMap(item => item.units.flatMap(unit => unit.values)))]
  return data.value?.find(item => item.type === state.type)?.units.find(unit => unit.unit === state.unit)?.values || []
})

function validate(state: ParameterEntity) {
  const errors = []

  if (!state.type)
    errors.push({ path: 'type', message: 'Обовʼязкове поле' })
  if (!state.value)
    errors.push({ path: 'value', message: 'Обовʼязкове поле' })

  return errors
}

async function onCreateOrUpdate() {
  loading.value = true

  try {
    await (props.preset
      ? edit(props.preset.id, state)
      : add(state))
    emit('submit')
  }
  catch (error: any) {
    toast.add({
      title: 'Не вдалось додати/змінити колір',
      description: error.message,
    })
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <UForm
    :state="state"
    :validate="validate"
    class="space-y-2"
    @submit="onCreateOrUpdate"
  >
    <UFormGroup
      label="Тип"
      name="type"
      required
    >
      <USelectMenu
        v-model="state.type"
        :options="types"
        searchable
        creatable
      >
        <template #option-create="{ option }">
          <span class="flex-shrink-0">Додати новий тип:</span>
          <span class="block truncate">{{ option }}</span>
        </template>
      </USelectMenu>
    </UFormGroup>
    <UFormGroup
      label="Одиниці вимірювання"
      name="unit"
    >
      <USelectMenu
        v-model="state.unit"
        :options="units"
        searchable
        creatable
      >
        <template #option-create="{ option }">
          <span class="flex-shrink-0">Додати нову одиницю вимірювання:</span>
          <span class="block truncate">{{ option }}</span>
        </template>
      </USelectMenu>
    </UFormGroup>
    <UFormGroup
      label="Значення"
      name="value"
      required
    >
      <USelectMenu
        v-model="state.value"
        :options="values"
        searchable
        creatable
      >
        <template #option-create="{ option }">
          <span class="flex-shrink-0">Додати нове значення:</span>
          <span class="block truncate">{{ option }}</span>
        </template>
      </USelectMenu>
    </UFormGroup>

    <UButton
      :loading="loading"
      type="submit"
      class="flex justify-center"
    >
      Зберегти
    </UButton>
  </UForm>
</template>