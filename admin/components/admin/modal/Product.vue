<script lang="ts" setup>
import { AdminModalGallery, AdminModalProductPrice } from '#components'
import type { ApplicationEntity, GalleryEntity, PriceEntity, ProductEntity } from '~/types/entities'

const props = defineProps<{
  preset?: ProductEntity | null
}>()
const emit = defineEmits<{
  submit: []
}>()

defineExpose({
  title: props.preset?.id ? 'Змінити продукт' : 'Додати продукт',
  ui: { width: 'sm:max-w-4xl' },
  props: {
    fullscreen: true,
  },
})

const { open } = useModalStore()
const toast = useToast()
const { add, edit } = useProductRepository()

const loading = ref(false)
const state: Partial<ProductEntity> = reactive({
  description: props.preset?.description,
  title: props.preset?.title,
  application: props.preset?.application,
  size: props.preset?.size,
  standart: props.preset?.standart,
  tags: props.preset?.tags,
  applications: props.preset?.applications || [],
  prices: props.preset?.prices || [],
  images: props.preset?.images || [],
  primaryImage: props.preset?.primaryImage,
})
const brand = ref<number | undefined>(props.preset?.brand?.id)
const category = ref<number | undefined>(props.preset?.category?.id)
const applications = computed({
  get() {
    return state.applications?.map(applications => applications.id) || []
  },
  set(value: number[]) {
    state.applications = value.map(id => ({ id } as ApplicationEntity))
  },
})

function validate(state: ProductEntity) {
  const errors = []

  if (!state.description)
    errors.push({ path: 'description', message: 'Обовʼязкове поле' })
  if (!state.title)
    errors.push({ path: 'title', message: 'Обовʼязкове поле' })

  return errors
}

async function onCreateOrUpdate() {
  loading.value = true

  const data = {
    ...state,
    brand: brand.value ? { id: brand.value } : undefined,
    category: category.value ? { id: category.value } : undefined,
  } as ProductEntity

  try {
    if (props.preset?.id)
      await edit(props.preset.id, data)
    else
      await add(data)

    emit('submit')
  }
  catch (error: any) {
    toast.add({
      title: 'Не вдалось додати/змінити продукт',
      description: error.message,
    })
  }
  finally {
    loading.value = false
  }
}

function callPriceModal(preset?: PriceEntity) {
  open(
    AdminModalProductPrice,
    {
      preset,
      onSubmit(price: PriceEntity) {
        if (!state.prices)
          state.prices = []

        if (preset)
          state.prices = state.prices.map(item => item.article === price.article ? price : item)

        else
          state.prices.push(price)
      },
    },
  )
}

function callGalleryModal() {
  open(
    AdminModalGallery,
    {
      multiple: true,
      selected: state.images || [],
      onSubmit(images) {
        state.images = images
      },
    },
  )
}

function removePrice(price: PriceEntity) {
  const index = state.prices?.findIndex(item => item.article === price.article)
  if (typeof index === 'number' && index !== -1)
    state.prices?.splice(index, 1)
}
</script>

<template>
  <UForm
    :state="state"
    :validate="validate"
    class="space-y-2"
    @submit="onCreateOrUpdate"
  >
    <div class="grid grid-cols-2 gap-2">
      <UFormGroup label="Бренди" name="brand">
        <AdminBrandSelector v-model="brand" />
      </UFormGroup>
      <UFormGroup label="Категорії" name="category">
        <AdminCategorySelector v-model="category" />
      </UFormGroup>
      <UFormGroup
        label="Назва"
        name="title"
        required
      >
        <UInput v-model="state.title" />
      </UFormGroup>
      <UFormGroup
        label="Застосування"
        name="application"
      >
        <AdminApplicationSelector v-model="applications" multiple />
      </UFormGroup>
      <UFormGroup
        label="Розмір"
        name="size"
      >
        <UInput v-model="state.size" />
      </UFormGroup>
      <UFormGroup
        label="Стандарт"
        name="standart"
      >
        <UInput v-model="state.standart" />
      </UFormGroup>
      <UFormGroup
        label="Теги для пошуку"
        name="tags"
      >
        <InputTags v-model="state.tags" />
      </UFormGroup>
      <UFormGroup
        label="Опис"
        name="description"
        required
        class="col-span-2"
      >
        <UTextarea v-model="state.description" :rows="11" />
      </UFormGroup>
      <UCard class="col-span-2">
        <template #header>
          <div class="flex justify-between items-center">
            <span>Ціни</span>
            <UButton @click="callPriceModal()">
              Додати ціну
            </UButton>
          </div>
        </template>
        <UTable
          :rows="state.prices"
          :columns="[
            { key: 'article', label: 'Артикул' },
            { key: 'price', label: 'Ціна' },
            { key: 'colors', label: 'Кольори' },
            { key: 'parameters', label: 'Характеристики' },
            { key: 'actions', label: 'Дії' },
          ]"
        >
          <template #colors-data="{ row }">
            <div class="flex gap-2 flex-wrap">
              <template v-if="row.colors.length">
                <UseColorList :colors="row.colors" />
              </template>
              <UBadge v-else label="Не вказано" color="gray" />
            </div>
          </template>
          <template #parameters-data="{ row }">
            <div class="flex gap-2 flex-wrap">
              <template v-if="row.parameters.length">
                <UBadge
                  v-for="parameter in row.parameters"
                  :key="parameter.id"
                  :label="`${parameter.type} ${parameter.value} ${parameter.unit}`"
                />
              </template>
              <UBadge v-else label="Не вказано" color="gray" />
            </div>
          </template>
          <template #actions-data="{ row }">
            <UDropdown
              :items="[
                [
                  {
                    label: 'Редагувати',
                    icon: 'i-heroicons-pencil-square-16-solid',
                    click: () => callPriceModal(row),
                  },
                  {
                    label: 'Видалити',
                    icon: 'i-heroicons-x-mark-16-solid',
                    click: () => removePrice(row),
                  },
                ],
              ]"
            >
              <UButton color="gray" variant="ghost" icon="i-heroicons-adjustments-horizontal-solid" />
            </UDropdown>
          </template>
        </UTable>
      </UCard>

      <UCard class="col-span-2">
        <template #header>
          <div class="flex justify-between items-center">
            <span>Зображення</span>
            <UButton @click="callGalleryModal()">
              Додати зображення
            </UButton>
          </div>
        </template>
        <UTable
          :rows="state.images"
          :columns="[
            { key: 'image', label: 'Зображення' },
            { key: 'title', label: 'Назва/Альтернативний текст' },
            { key: 'isPrimary', label: 'Використовувати як основний' },
          ]"
        >
          <template #image-data="{ row }">
            <BaseImage :src="row.image" class="aspect-[1/1] object-contain w-20" />
          </template>
          <template #title-data="{ row }">
            <span class="truncate">{{ row.title }}</span>
          </template>
          <template #isPrimary-data="{ row }">
            <UCheckbox :model-value="state.primaryImage?.id === row.id" @update:model-value="state.primaryImage = row" />
          </template>
        </UTable>
      </UCard>
    </div>
    <div class="flex justify-end">
      <UButton
        :loading="loading"
        type="submit"
        class="flex justify-center"
      >
        Зберегти
      </UButton>
    </div>
  </UForm>
</template>
