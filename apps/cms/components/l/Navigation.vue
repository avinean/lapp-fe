<script setup lang="ts">
const { get} = useNavigationRepository()
const { data } = await useAsyncData(
  () => get(),
)
</script>

<template>
  <template v-for="link, key in data?.navigation" :key>
    <UDropdown v-if="link.children?.length" :items="[link.children] as any" mode="hover" :popper="{ placement: 'bottom-start' }">
      <ULink :to="link.to" class="p-2" active-class="border-b-2" inactive-class="border-b-2 border-transparent">
        {{ link.title }}
      </ULink>
      <template #item="{ item }">
        <ULink :to="item.to">
          {{ item.title }}
        </ULink>
      </template>
    </UDropdown>
    <ULink v-else :to="link.to" class="p-2" active-class="border-b-2" inactive-class="border-b-2 border-transparent">
      {{ link.title }}
    </ULink>
  </template>
</template>
