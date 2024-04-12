<script lang="ts" setup>
import type { CategoryEntity } from '~/types/entities'

const props = defineProps<{
  preset?: CategoryEntity | null
}>()
const emit = defineEmits<{
  submit: []
}>()

defineExpose({
  title: props.preset?.id ? 'Змінити категорію' : 'Додати категорію',
})

const toast = useToast()
const { add, edit } = useCategoryRepository()
const { photo, url, add: addPhoto } = usePhoto(props.preset?.image)

const loading = ref(false)
const state: Partial<CategoryEntity> = reactive({
  description: props.preset?.description,
  title: props.preset?.title,
  image: props.preset?.image,
})

function validate(state: CategoryEntity) {
  const errors = []
  if (!state.description)
    errors.push({ path: 'description', message: 'Обовʼязкове поле' })
  if (!state.title)
    errors.push({ path: 'title', message: 'Обовʼязкове поле' })

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

  const data = {
    ...state,
    image: url.value,
  } as CategoryEntity

  try {
    if (props.preset?.id)
      await edit(props.preset.id, data)
    else
      await add(data)
    emit('submit')
  }
  catch (error: any) {
    toast.add({
      title: 'Не вдалось додати/змінити категорію',
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
      label="Опис"
      name="description"
      required
    >
      <UTextarea v-model="state.description" />
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
