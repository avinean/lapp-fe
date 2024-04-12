<script lang="ts" setup>
import type { ColorEntity, ProductEntity } from '~/types/entities'

const emit = defineEmits<{
  submit: []
}>()

defineExpose({
  title: 'Додати Колір',
})

const toast = useToast()
const { add } = useColorRepository()
const { photo, url, add: addPhoto } = usePhoto()

const loading = ref(false)
const state: Partial<ColorEntity> = reactive({
  title: undefined,
  value: undefined,
})

function validate(state: ColorEntity) {
  const errors = []

  if (!state.title)
    errors.push({ path: 'title', message: 'Обовʼязкове поле' })
  if (!(state.value || photo.value))
    errors.push({ path: 'value', message: 'Значення, або зображення обовʼязкове' })

  return errors
}

async function onCreateOrUpdate() {
  loading.value = true
  try {
    await addPhoto()
  }
  catch (error: any) {
    toast.add({
      title: 'Помилка завантаження фото',
      description: error.message,
    })
  }

  try {
    await add({
      ...state,
      image: url.value,
    })

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
    <input-file
      class="block w-40 m-auto"
      :src="state.image"
      @change="photo = $event"
    />
    <UFormGroup
      label="Назва"
      name="title"
      required
    >
      <UInput v-model="state.title" />
    </UFormGroup>
    <UFormGroup
      label="Значення"
      name="value"
      hint="Обовʼяково вказати колір або обрати зображення"
      help="Для прикладу: #ff0000, red, rgb(255, 0, 0)"
    >
      <div class="grid grid-cols-2 gap-2">
        <UInput v-model="state.value" />
        <div class="border" :style="{ background: state.value }" />
      </div>
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