<script setup lang="ts">
import { AdminModalApplication } from '#components'

const applicationRepository = useApplicationRepository()
const { open } = useModalStore()

const { data: applications, refresh: refreshApplications } = useAsyncData(() => applicationRepository.get())

function addApplication() {
  open(AdminModalApplication, {
    onSubmit() { refreshApplications() },
  })
}
</script>

<template>
  <div class="space-y-2">
    <UCard>
      <template #header>
        <div class="flex justify-between">
          <span class="text-2xl">Вид застосування</span>
          <UButton icon="i-heroicons-folder-plus-16-solid" @click="addApplication">
            Додати вид застосування
          </UButton>
        </div>
      </template>
      <UTable
        v-if="applications"
        :rows="applications"
        :columns="[
          {
            key: 'title',
            label: 'Назва',
          },
          {
            key: 'description',
            label: 'Опис',
          },
        ]"
      />
    </UCard>
  </div>
</template>
