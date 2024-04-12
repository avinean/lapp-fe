<script lang="ts" setup>
import { AdminColorSelector } from '#components'
import type { AdminParameterSelector } from '#components'
import type { ColorEntity, ParameterEntity, PriceEntity, ProductEntity } from '~/types/entities'

const props = defineProps<{
  preset?: PriceEntity | null
}>()
const emit = defineEmits<{
  submit: [price: PriceEntity]
}>()

defineExpose({
  title: props.preset ? 'Змінити ціни продукту' : 'Додати ціни продукту',
})

const colorSelector = ref<InstanceType<typeof AdminColorSelector>>()
const parametersSelector = ref<InstanceType<typeof AdminParameterSelector>>()

function validate(state: ProductEntity) {
  const errors = []

  if (!state.price)
    errors.push({ path: 'price', message: 'Обовʼязкове поле' })

  return errors
}

const state = ref<Partial<PriceEntity>>({
  price: props.preset?.price,
  colors: props.preset?.colors,
  parameters: props.preset?.parameters,
})
const colors = computed({
  get() {
    return state.value?.colors?.map(color => color.id) || []
  },
  set(value: number[]) {
    state.value!.colors = value.map(id => ({ id } as ColorEntity))
  },
})
const parameters = computed({
  get() {
    return state.value?.parameters?.map(parameter => parameter.id) || []
  },
  set(value: number[]) {
    state.value!.parameters = value.map(id => ({ id } as ParameterEntity))
  },
})

function onCreateOrUpdate() {
  emit('submit', {
    ...props.preset,
    ...state.value,
    colors: colorSelector.value?.selectedColors || [],
    parameters: parametersSelector.value?.selectedParameters || [],
  } as PriceEntity)
}
</script>

<template>
  <UForm
    :state="state"
    :validate="validate"
    class="space-y-2"
  >
    <UFormGroup name="price">
      <UInput v-model.number="state.price" type="number" step="any">
        <template #trailing>
          <span class="text-gray-500 dark:text-gray-400 text-xs">ГРН</span>
        </template>
      </UInput>
    </UFormGroup>
    <UFormGroup name="price">
      <AdminColorSelector v-slot="{ colors: _ }" ref="colorSelector" v-model="colors" multiple>
        <div class="flex flex-wrap gap-2 pt-2">
          <UBadge v-for="c in _" :key="c.id" :label="c.title" />
        </div>
      </AdminColorSelector>
    </UFormGroup>
    <UFormGroup name="price">
      <AdminParameterSelector v-slot="{ parameters: _ }" ref="parametersSelector" v-model="parameters" multiple>
        <div class="flex flex-wrap gap-2 pt-2 ">
          <UBadge
            v-for="parameter in _"
            :key="parameter.id"
            :label="`${parameter.type} ${parameter.value} ${parameter.unit}`"
          />
        </div>
      </AdminParameterSelector>
    </UFormGroup>
    <div class="flex justify-end">
      <UButton
        type="submit"
        class="flex justify-center"
        @click="onCreateOrUpdate"
      >
        Зберегти
      </UButton>
    </div>
  </UForm>
</template>
