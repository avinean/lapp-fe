<script lang="ts" setup>
import type { CmsEntity, PageEntity } from '~/types/cms'

const props = defineProps<{
  preset?: PageEntity | null
}>()
const emit = defineEmits<{
  submit: []
}>()

defineExpose({
  title: props.preset?.id ? 'Змінити сторінку' : 'Додати сторінку',
})

const toast = useToast()
const { add, edit } = usePageRepository()
const { data } = useAsyncData(() => useCmsRepository().get())

const loading = ref(false)

const state: Partial<PageEntity> = reactive({
  title: props.preset?.title || '',
  meta: props.preset?.meta || [],
  breadcrumbs: props.preset?.breadcrumbs || [],
  section: props.preset?.section,
  slug: props.preset?.slug || '',
})

const meta = ref<PageEntity['meta'][number]>({
  name: '',
  content: '',
})

function addMeta() {
  if (!meta.value.name || !meta.value.content)
    return

  state.meta!.push(meta.value)
  meta.value = { name: '', content: '' }
}

function removeMeta(index: number) {
  state.meta!.splice(index, 1)
}

const breadcrumb = ref<PageEntity['breadcrumbs'][number]>({
  label: '',
  to: '',
})

function addBreadcrumb() {
  if (!breadcrumb.value.label)
    return

  state.breadcrumbs!.push(breadcrumb.value)
  breadcrumb.value = { label: '', to: '' }
}

function removeBreadcrumb(index: number) {
  state.breadcrumbs!.splice(index, 1)
}

function validate(state: CmsEntity) {
  const errors = []

  if (!state.title)
    errors.push({ path: 'title', message: 'Обовʼязкове поле' })
  if (!state.slug)
    errors.push({ path: 'slug', message: 'Обовʼязкове поле' })

  return errors
}

async function onCreateOrUpdate() {
  loading.value = true

  try {
    if (props.preset?.id)
      await edit(props.preset.id, state)
    else
      await add(state)

    emit('submit')
  }
  catch (error: any) {
    toast.add({
      title: 'Не вдалось додати/змінити секцію',
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
    class="space-y-4"
    @submit="onCreateOrUpdate"
  >
    <UFormGroup label="Назва" name="title">
      <UInput v-model="state.title" />
    </UFormGroup>
    <UFormGroup label="Слаг" name="slug">
      <UInput v-model="state.slug" />
    </UFormGroup>
    <UFormGroup label="Мета" name="meta">
      <div class="flex items-end gap-2">
        <UFormGroup label="name">
          <UInput v-model="meta.name" />
        </UFormGroup>
        <UFormGroup label="content">
          <UInput v-model="meta.content" />
        </UFormGroup>
        <UButton
          class="flex justify-center"
          @click="addMeta()"
        >
          Додати мету
        </UButton>
      </div>
      <UTable
        :rows="state.meta" :columns="[
          { key: 'name', label: 'Name' },
          { key: 'content', label: 'Content' },
          { key: 'actions' },
        ]"
      >
        <template #actions-data="{ index }">
          <UButton
            icon="i-heroicons-trash-16-solid"
            @click="removeMeta(index)"
          />
        </template>
      </UTable>
    </UFormGroup>
    <UFormGroup label="Хлібні крихти" name="breadcrumbs">
      <div class="flex items-end gap-2">
        <UFormGroup label="Назва">
          <UInput v-model="breadcrumb.label" />
        </UFormGroup>
        <UFormGroup label="Посилання">
          <UInput v-model="breadcrumb.to" />
        </UFormGroup>
        <UButton
          class="flex justify-center"
          @click="addBreadcrumb()"
        >
          Додати хлібну крихту
        </UButton>
      </div>
      <UTable
        :rows="state.breadcrumbs" :columns="[
          { key: 'label', label: 'Назва'},
          { key: 'to', label: 'Посилання'},
          { key: 'actions' },
        ]"
      >
        <template #actions-data="{ index }">
          <UButton
            icon="i-heroicons-trash-16-solid"
            @click="removeBreadcrumb(index)"
          />
        </template>
      </UTable>
    </UFormGroup>
    <UFormGroup label="Секція" name="section">
      <USelect v-if="data" v-model="state.section" :options="data" value-attribute="id" option-attribute="title" />
    </UFormGroup>

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
