<script setup lang="ts">
import type { ContactEntity } from '~/types/entities'
import { VisibilityStatus } from '~/types/enums'

const statuses = ref<VisibilityStatus[]>([
  VisibilityStatus.Published,
  VisibilityStatus.Draft,
])
const toast = useToast()
const { get, add, edit, publish, draft, archive } = useContactRepository()
const { data, refresh } = useAsyncData(
  () => get({ statuses: statuses.value.join(',') }),
  { watch: [statuses] },
)

const loading = ref()
const contact = ref<Partial<ContactEntity> | null>(null)
const edittingId = ref<number | null>(null)

function callAddEdit(preset?: Partial<ContactEntity>) {
  edittingId.value = preset?.id || null
  contact.value = {
    address: preset?.address || undefined,
    phones: preset?.phones || undefined,
    emails: preset?.emails || undefined,
  }
}

async function onCreateOrUpdate() {
  loading.value = true

  try {
    if (edittingId.value)
      await edit(edittingId.value, contact.value!)
    else
      await add(contact.value!)
    refresh()
    contact.value = null
    edittingId.value = null
  }
  catch (error: any) {
    toast.add({
      title: 'Не вдалось додати/змінити контакт',
      description: error.message,
    })
  }
  finally {
    loading.value = false
  }
}

function validate(state: ContactEntity) {
  const errors = []

  if (!state.address)
    errors.push({ path: 'address', message: 'Обовʼязкове поле' })

  return errors
}
</script>

<template>
  <UCard>
    <template #header>
      <div class="flex justify-between">
        <span class="text-2xl">Контакти</span>
        <UButton icon="i-heroicons-folder-plus-16-solid" @click="callAddEdit()">
          Додати контакт
        </UButton>
      </div>
    </template>
    <div class="border-b pb-2">
      <UFormGroup label="Статуси" class="w-40">
        <AdminStatusSelector v-model="statuses" />
      </UFormGroup>
    </div>

    <UForm
      v-if="contact"
      :state="contact"
      :validate="validate"
      class="space-y-2"
      @submit="onCreateOrUpdate"
    >
      <UTable
        :rows="[contact]"
        :columns="[
          { key: 'address', label: 'Адреса/Назва' },
          { key: 'phones', label: 'Телефонні номери' },
          { key: 'emails', label: 'Електронні пошти' },
          { key: 'actions', label: 'Дії' },
        ]"
      >
        <template #address-data>
          <UFormGroup name="address">
            <UInput v-model="contact.address" />
          </UFormGroup>
        </template>
        <template #phones-data>
          <UFormGroup name="phones">
            <InputTags v-model="contact.phones" />
          </UFormGroup>
        </template>
        <template #emails-data>
          <UFormGroup name="emails">
            <InputTags v-model="contact.emails" />
          </UFormGroup>
        </template>
        <template #actions-data>
          <UButton :loading="loading" type="submit">
            Зберегти
          </UButton>
        </template>
      </UTable>
    </UForm>
    <UTable
      v-if="data"
      :rows="data"
      :columns="[
        { key: 'status', label: 'Статус' },
        { key: 'address', label: 'Адреса/Назва' },
        { key: 'phones', label: 'Телефонні номери' },
        { key: 'emails', label: 'Електронні пошти' },
        { key: 'createdAt', label: 'Створено' },
        { key: 'updatedAt', label: 'Оновлено' },
        { key: 'actions', label: 'Дії' },
      ]"
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
      <template #address-data="{ row }">
        <div class="max-w-32 overflow-hidden text-elipsis">
          {{ row.address }}
        </div>
      </template>
      <template #phones-data="{ row }">
        <div class="max-w-32 overflow-hidden text-elipsis">
          {{ row.phones }}
        </div>
      </template>
      <template #emails-data="{ row }">
        <div class="max-w-32 overflow-hidden text-elipsis">
          {{ row.emails }}
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
                click: () => callAddEdit(row),
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
  </UCard>
</template>