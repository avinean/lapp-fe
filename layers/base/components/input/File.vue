<script setup lang="ts">
defineProps<{
  src?: string
  multiple?: boolean
}>()

const emit = defineEmits<{
  change: [file: File],
  select: [files: File[]]
}>()

const imageUrl = ref('')

function handleFileChange(event: any) {
  emit('select', [...event.target.files])
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e: any) => {
      imageUrl.value = e.target.result
      emit('change', file)
    }
    reader.readAsDataURL(file)
  }
}
</script>

<template>
  <label class="cursor-pointer relative">
    <input
      type="file"
      hidden
      :multiple="multiple"
      accept="image/png, image/jpeg, image/jpg, image/svg+xml, image/webp, image/gif"
      @change="handleFileChange"
    >
    <slot>
      <BaseImage
        :src="imageUrl || src"
        class="object-contain"
      />
      <div class="flex items-center justify-center bg-primary absolute bottom-0 left-0 right-0 p-2">
        <span class="i-heroicons-camera-20-solid text-white text-2xl" />
      </div>
    </slot>
  </label>
</template>
