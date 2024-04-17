<script lang="ts" setup>
import type { QuizEntity } from '~/types/components/quiz'

defineProps<{
  title: string
}>()
defineEmits<{
  delete: []
}>()
const model = defineModel<QuizEntity>()

function setType(type: QuizEntity['type']) {
  const newEntity = { type } as QuizEntity
  if (type === 'text')
    newEntity.value = ''
  else if (type === 'image')
    newEntity.value = { src: '', alt: '' }
  else if (type === 'textToSpeach')
    newEntity.value = { text: '', lang: '' }
  else if (type === 'video')
    newEntity.value = { src: '', poster: '' }
  else if (type === 'audio')
    newEntity.value = { src: '' }

  model.value = newEntity
}
</script>

<template>
  <UCard>
    <template #header>
      <div class="flex justify-between items-center">
        <h3>{{ title }}</h3>
        <BaseActionBar
          :items="[
            {
              icon: 'i-heroicons-chat-bubble-bottom-center-text',
              tooltip: 'Use text question',
              onClick: () => setType('text'),
            },
            {
              icon: 'i-heroicons-photo',
              tooltip: 'Use image question',
              onClick: () => setType('image'),
            },
            {
              icon: 'i-heroicons-speaker-wave',
              tooltip: 'Use text to speach question',
              onClick: () => setType('textToSpeach'),
            },
            {
              icon: 'i-heroicons-video-camera',
              tooltip: 'Use video question',
              onClick: () => setType('video'),
            },
            {
              icon: 'i-heroicons-play',
              tooltip: 'Use audio question',
              onClick: () => setType('audio'),
            },
            {
              icon: 'i-heroicons-trash',
              tooltip: 'Remove question',
              onClick: () => $emit('delete'),
            },
          ]"
        />
      </div>
    </template>
    <template v-if="model?.type === 'text'">
      <UFormGroup label="Question">
        <UTextarea v-model="model.value" />
      </UFormGroup>
    </template>
    <template v-else-if="model?.type === 'image'">
      <UFormGroup label="Image">
        <InputFile v-model="model.value.src" class="block w-40" />
      </UFormGroup>
      <UFormGroup label="Alt">
        <UInput v-model="model.value.alt" />
      </UFormGroup>
    </template>
    <template v-else-if="model?.type === 'textToSpeach'">
      <UFormGroup label="Text">
        <UTextarea v-model="model.value.text" />
      </UFormGroup>
      <UFormGroup label="Language">
        <UInput v-model="model.value.lang" />
      </UFormGroup>
    </template>
    <template v-else-if="model?.type === 'video'">
      <UFormGroup label="Video">
        <InputFile v-model="model.value.src" class="block w-40" />
      </UFormGroup>
      <UFormGroup label="Poster">
        <InputFile v-model="model.value.poster" class="block w-40" />
      </UFormGroup>
    </template>
    <template v-else-if="model?.type === 'audio'">
      <UFormGroup label="Audio">
        <InputFile v-model="model.value.src" class="block w-40" />
      </UFormGroup>
    </template>
    <slot />
  </UCard>
</template>
