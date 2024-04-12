<script lang="ts" setup>
import type { BrandEntity } from '~/types/entities'

const props = defineProps<{
  preset?: BrandEntity | null
}>()
const emit = defineEmits<{
  submit: []
}>()

defineExpose({
  title: props.preset?.id ? 'Змінити бренд' : 'Додати бренд',
})

const toast = useToast()
const { add, edit } = useBrandRepository()
const { photo, url, add: addPhoto } = usePhoto(props.preset?.image)

// const isMaterialBrand = ref(false)

const loading = ref(false)
const state: Partial<BrandEntity> = reactive({
  description: props.preset?.description,
  title: props.preset?.title,
  image: props.preset?.image,
})

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
    // type: isMaterialBrand.value ? BrandType.Material : BrandType.Product,
    image: url.value,
  } as BrandEntity

  try {
    if (props.preset?.id)
      await edit(props.preset.id, data)
    else
      await add(data)

    emit('submit')
  }
  catch (error: any) {
    console.log(error)
    toast.add({
      title: 'Не вдалось додати/змінити бренд',
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
    class="space-y-2"
    @submit="onCreateOrUpdate"
  >
    <input-file
      class="block w-44 m-auto"
      :src="state.image"
      @change="photo = $event"
    />
    <!-- <UFormGroup
      label="Бренд матеріалу"
      name="isMaterialBrand"
    >
      <UCheckbox v-model="isMaterialBrand" />
    </UFormGroup> -->
    <UFormGroup
      label="Назва"
      name="title"
    >
      <UInput v-model="state.title" />
    </UFormGroup>
    <UFormGroup
      label="Опис"
      name="description"
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