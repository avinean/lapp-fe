<script setup lang="ts">
import { AdminModalNavigation, AdminModalPage } from '#components'
import type { NavigationEntity, PageEntity } from '~/types/cms'
import { VisibilityStatus } from '~/types/enums'

const modalStore = useModalStore()
const toast = useToast()

const { get: getNavigation, edit: editNavigation } = useNavigationRepository()
const { get, publish, draft, archive } = usePageRepository()
const { data, refresh, status } = useAsyncData(() => get())
const { data: navigations, refresh: refreshNavigation } = useAsyncData(() => getNavigation())

function callModal(preset?: PageEntity) {
  modalStore.open(AdminModalPage, {
    preset,
    onSubmit() { refresh() },
  })
}

const isEdit = ref(false)
const navigation = ref<NavigationEntity['navigation'][number]>({
  title: '',
  to: '',
  order: 0,
})

function addNavigation() {
  if (!navigations.value || !navigation.value.title || !navigation.value.to)
    return

  navigations.value.navigation.push(navigation.value)
  navigation.value = { title: '', to: '', order: 0 }
  saveNavigation()
}

function removeNavigation(index: number) {
  navigations.value?.navigation.splice(index, 1)
  saveNavigation()
}

async function saveNavigation() {
  if (!navigations.value)
    return
  try {
    await editNavigation(navigations.value.id, navigations.value)
  }
  catch (error: any) {
    console.error(error)
    toast.add({
      title: 'Не вдалось зберегти налаштування навігації',
      description: error.message,
    })
  }
  refreshNavigation()
}
</script>

<template>
  <UCard>
    <template #header>
      <span class="text-2xl">Навігація</span>
    </template>
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
      v-if="navigations"
      :rows="navigations?.navigation?.sort((a, b) => a.order - b.order) || []"
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
          @click="row.order--; saveNavigation()"
        />
        <UButton
          icon="i-heroicons-chevron-down"
          @click="row.order++; saveNavigation()"
        />
        <UButton
          icon="i-heroicons-pencil-16-solid"
          @click="modalStore.open(AdminModalNavigation, {
            preset: row,
            onSubmit(state) {
              Object.assign(row, state)
              saveNavigation()
            },
          })"
        />
        <UButton
          icon="i-heroicons-trash-16-solid"
          @click="removeNavigation(index)"
        />
      </template>
    </UTable>
  </UCard>
  <UCard>
    <template #header>
      <div class="flex justify-between">
        <span class="text-2xl">Сторінки</span>
        <UButton icon="i-heroicons-folder-plus-16-solid" @click="() => callModal()">
          Додати сторінку
        </UButton>
      </div>
    </template>
    <template v-if="data">
      <UTable
        :rows="data"
        :columns="[
          { key: 'status', label: 'Статус' },
          { key: 'slug', label: 'Слаг' },
          { key: 'title', label: 'Назва' },
          { key: 'createdAt', label: 'Створено' },
          { key: 'updatedAt', label: 'Оновлено' },
          { key: 'actions', label: 'Дії' },
        ]"
        :loading="status === 'pending'"
        :loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'Loading...' }"
      >
        <template #status-data="{ row }">
          <UBadge v-if="row.status === VisibilityStatus.Draft" variant="subtle" color="gray">
            Чорновик
          </UBadge>
          <UBadge v-else-if="row.status === VisibilityStatus.Archived" color="black">
            Архівовано
          </UBadge>
          <UBadge v-else variant="subtle" color="green">
            Опублікований
          </UBadge>
        </template>
        <template #title-data="{ row }">
          <div class="max-w-32 overflow-hidden text-elipsis">
            {{ row.title }}
          </div>
        </template>
        <template #createdAt-data="{ row }">
          <div class="max-w-32 overflow-hidden text-elipsis">
            <base-datetime :date="row.createdAt" />
          </div>
        </template>
        <template #updatedAt-data="{ row }">
          <div class="max-w-32 overflow-hidden text-elipsis">
            <base-datetime :date="row.updatedAt" />
          </div>
        </template>
        <template #actions-data="{ row }">
          <UDropdown
            :items="[
              [
                {
                  label: 'Редагувати',
                  icon: 'i-heroicons-pencil-square-16-solid',
                  click: () => callModal(row),
                },
                {
                  label: row.status === VisibilityStatus.Draft ? 'Опублікувати' : 'Приховати',
                  icon: row.status === VisibilityStatus.Draft ? 'i-heroicons-eye-solid' : 'i-heroicons-eye-slash-solid',
                  click: async () => {
                    await (row.status === VisibilityStatus.Draft ? publish(row.id) : draft(row.id))
                    refresh()
                  },
                },
              ],
              [
                {
                  label: row.status === VisibilityStatus.Archived ? 'Розархівувати' : 'Архівувати',
                  icon: row.status === VisibilityStatus.Archived ? 'i-heroicons-folder-plus-16-solid' : 'i-heroicons-folder-minus-16-solid',
                  click: async () => {
                    await (row.status === VisibilityStatus.Archived ? draft(row.id) : archive(row.id))
                    refresh()
                  },
                },
              ],
            ]"
          >
            <UButton color="gray" variant="ghost" icon="i-heroicons-adjustments-horizontal-solid" />
          </UDropdown>
        </template>
      </UTable>
    </template>
  </UCard>
</template>
