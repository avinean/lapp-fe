<script lang="ts" setup>
import type { GroupSection } from '~/types/cms'

defineProps<GroupSection>()
</script>

<template>
  <div class="space-y-4">
    <CmsSection :content="sections" />
  </div>
</template>
