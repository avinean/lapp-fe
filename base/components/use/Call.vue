<script setup lang="ts">
const open = ref(false)
const sent = ref(false)

whenever(sent, () => {
  if (sent.value) {
    setTimeout(() => {
      open.value = false
      sent.value = false
    }, 3000)
  }
})
</script>

<template>
  <slot :call="() => open = true">
    <button>
      Передзвонити мені
    </button>
  </slot>

  <UModal v-model="open">
    <div class="bg-white p-4 w-90">
      <h2 v-if="sent" class="flex justify-between items-center">
        <span class="text-xl">
          Дякуємо за звернення!
        </span>
      </h2>
      <template v-else>
        <h2 class="flex justify-between items-center mb-4">
          <span class="text-xl">
            Замовити зворотній дзвінок
          </span>
          <button class="i-heroicons-x-mark-16-solid text-gray text-2xl" @click="open = false" />
        </h2>
        <FormCall @submit="sent = true" />
      </template>
    </div>
  </UModal>
</template>
