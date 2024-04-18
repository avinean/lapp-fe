<script setup lang="ts">
import type { NavigationEntity } from '~/types/cms'

const props = defineProps<{
  preset: NavigationEntity['navigation'][number]
}>()

const emit = defineEmits<{
  submit: [value: NavigationEntity['navigation'][number]]
}>()

defineExpose({
  title: 'Змінити пункт навігації',
})

const isEdit = ref(false)

const state = reactive<NavigationEntity['navigation'][number] >({
  title: props.preset.title || '',
  to: props.preset.to || '',
  order: props.preset.order || 0,
  children: [...(props.preset.children || [])],
})

const navigation = ref<NavigationEntity['navigation'][number]>({
  title: '',
  to: '',
  order: 0,
})

function addNavigation() {
  if (!state.children || !navigation.value.title || !navigation.value.to)
    return

  state.children.push(navigation.value)
  navigation.value = { title: '', to: '', order: 0 }
}

function removeNavigation(index: number) {
  state.children?.splice(index, 1)
}

function onUpdate() {
  emit('submit', state)
}
</script>

<template>
  <UForm
    :state="state" 
    class="space-y-4"
    @submit="onUpdate"
  >
    <UFormGroup label="Назва">
      <UInput v-model="state.title" />
    </UFormGroup>
    <UFormGroup label="Посилання">
      <UInput v-model="state.to" />
    </UFormGroup>
    <h4 class="h4">
      Підменю
    </h4>
    <div class="flex items-end gap-2">
      <UFormGroup label="Назва">
        <UInput v-model="navigation.title" />
      </UFormGroup>
      <UFormGroup label="Посилання">
        <UInput v-model="navigation.to" />
      </UFormGroup>
      <UButton
        v-if="!isEdit"
        class="flex justify-center"
        @click="addNavigation()"
      >
        Додати пункт навігації
      </UButton>
      <UButton
        v-else
        class="flex justify-center"
        @click="navigation = { title: '', to: '', order: 0 }; isEdit = false"
      >
        Очистити
      </UButton>
    </div>
    <UTable
      v-if="state.children"
      :rows="state.children.sort((a, b) => a.order - b.order) || []"
      :columns="[
        { key: 'order', label: 'Послідовність' },
        { key: 'title', label: 'Назва' },
        { key: 'to', label: 'Посилання' },
        { key: 'actions' },
      ]"
    >
      <template #actions-data="{ index, row }">
        <UButton
          icon="i-heroicons-chevron-up"
          @click="row.order--"
        />
        <UButton
          icon="i-heroicons-chevron-down"
          @click="row.order++"
        />
        <UButton
          icon="i-heroicons-pencil-16-solid"
          @click="navigation = row; isEdit = true"
        />
        <UButton
          icon="i-heroicons-trash-16-solid"
          @click="removeNavigation(index)"
        />
      </template>
    </UTable>
    <div class="flex justify-end">
      <UButton
        type="submit"
        class="flex justify-center"
      >
        Зберегти
      </UButton>
    </div>
  </UForm>
</template>
