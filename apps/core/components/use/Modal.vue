<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    index?: number
  }>(),
  {
    index: 0,
  },
)
const { configs, close } = useModalStore()
const modal = computed(() => configs[props.index])

const modalContent = ref<{ title: string, ui: any, props: any } | null>(null)
</script>

<template>
  <UModal
    :model-value="!!modal"
    prevent-close
    :ui="modalContent?.ui"
    v-bind="modalContent?.props"
    @close="close"
  >
    <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
      <template #header>
        <div class="flex justify-between p-2">
          <h1 class="text-3xl font-bold">
            {{ modalContent?.title }}
          </h1>
          <UButton
            :padded="false"
            color="gray"
            variant="link"
            icon="i-heroicons-x-mark-16-solid"
            @click="close"
          />
        </div>
      </template>
      <component
        :is="modal?.component"
        ref="modalContent"
        v-bind="modal?.props"
        @submit="close"
      />
    </UCard>
    <UseModal :index="index + 1" />
  </UModal>
</template>
