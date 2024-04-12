<script lang="ts" setup>
import type { HeaderNavigationSection, NavigationItem } from '~/types/cms'

const props = defineProps<HeaderNavigationSection>()

const items = computed(() => {
  if (Array.isArray(props.items))
    return props.items
  try {
    return JSON.parse(props.items) as NavigationItem[]
  }
  catch (e) {
    console.log(e)
    return []
  }
})
</script>

<template>
  <template v-for="link, key in items" :key>
    <UDropdown v-if="link.children?.length" :items="[link.children]" mode="hover" :popper="{ placement: 'bottom-start' }">
      <ULink :to="link.to" class="p-2" active-class="border-b-2" inactive-class="border-b-2 border-transparent">
        {{ link.label }}
      </ULink>
      <template #item="{ item }">
        <ULink :to="item.to">
          {{ item.label }}
        </ULink>
      </template>
    </UDropdown>
    <ULink v-else :to="link.to" class="p-2" active-class="border-b-2" inactive-class="border-b-2 border-transparent">
      {{ link.label }}
    </ULink>
  </template>
</template>
