<script lang="ts" setup>
import type { GalleryEntity } from '~/types/entities'

const emit = defineEmits<{
  submit: [email: string]
}>()

defineExpose({
  title: 'Email',
})

const email = ref('')

function submit() {
  if (!email.value)
    return
  emit('submit', email.value)
}
</script>

<template>
  <div class="space-y-2">
    <div class="p-2">
      Set your email to save your progress
    </div>
    <UFormGroup label="Email">
      <UInput v-model="email" type="email" />
    </UFormGroup>
    <div class="flex justify-end p-2">
      <UButton @click="submit">
        Ok
      </UButton>
    </div>
  </div>
</template>
