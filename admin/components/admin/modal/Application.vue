<script lang="ts" setup>
import type { ApplicationEntity, ColorEntity, ProductEntity } from '~/types/entities'

const emit = defineEmits<{
  submit: []
}>()

defineExpose({
  title: 'Додати вид застосування',
})

const toast = useToast()
const { add } = useApplicationRepository()

const loading = ref(false)
const state: Partial<ApplicationEntity> = reactive({
  title: undefined,
  description: undefined,
})

function validate(state: ApplicationEntity) {
  const errors = []

  if (!state.title)
    errors.push({ path: 'title', message: 'Обовʼязкове поле' })

  return errors
}

async function onCreateOrUpdate() {
  loading.value = true
  try {
    await add(state)
    emit('submit')
  }
  catch (error: any) {
    toast.add({
      title: 'Не вдалось додати/змінити вид',
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
      label="Назва"
      name="title"
      required
    >
      <UInput v-model="state.title" />
    </UFormGroup>
    <UFormGroup
      label="Опис"
      name="description"
    >
      <UInput v-model="state.description" />
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