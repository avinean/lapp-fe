<script lang="ts" setup>
import type { CardSection } from '~/types/cms'

defineProps<CardSection>()
</script>

<template>
  <UCard>
    <CmsSection :content="sections" />
  </UCard>
</template>
