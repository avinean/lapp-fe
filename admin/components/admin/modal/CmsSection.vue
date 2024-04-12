<script lang="ts" setup>
import type { CmsEntity } from '~/types/cms'

const props = defineProps<{
  preset?: CmsEntity | null
}>()
const emit = defineEmits<{
  submit: []
}>()

defineExpose({
  title: props.preset?.id ? 'Змінити секцію' : 'Додати секцію',
  props: {
    fullscreen: true,
  },
})

const toast = useToast()
const { add, edit } = useCmsRepository()

const loading = ref(false)
const state: Partial<CmsEntity> = reactive({
  title: props.preset?.title,
  content: props.preset?.content || [],
})
function validate(state: CmsEntity) {
  const errors = []

  if (!state.title)
    errors.push({ path: 'title', message: 'Обовʼязкове поле' })
  if (!state.content)
    errors.push({ path: 'content', message: 'Обовʼязкове поле' })

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
      label="Контент"
      name="content"
      required
    >
      <CmsSectionComposer :sections="state.content!" @update="state.content = $event" />
    </UFormGroup>

    <UCard class="p-2">
      <template #header>
        <h2 class="text-3xl">
          Попередній перегляд
        </h2>
      </template>
      <CmsSection :key="JSON.stringify(state.content)" :content="state.content" />
    </UCard>

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
