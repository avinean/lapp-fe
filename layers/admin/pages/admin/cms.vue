<script setup lang="ts">
import { AdminModalCmsSection } from '#components'
import type { CmsEntity } from '~/types/cms'
import { VisibilityStatus } from '~/types/enums'

const modalStore = useModalStore()

const { get, publish, draft, archive } = useCmsRepository()
const { data, refresh, status } = useAsyncData(() => get())

function callModal(preset?: CmsEntity) {
  modalStore.open(AdminModalCmsSection, {
    preset,
    onSubmit() { refresh() },
  })
}
</script>

<template>
  <UCard>
    <template #header>
      <div class="flex justify-between">
        <span class="text-2xl">Секції</span>
        <UButton icon="i-heroicons-folder-plus-16-solid" @click="() => callModal()">
          Додати секцію
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
