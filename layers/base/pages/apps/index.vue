<script lang="ts" setup>
const apps = [
  {
    key: 'quiz',
    title: 'Quiz',
  },
]
</script>

<template>
  <div class="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
    <template v-for="app in apps" :key="app.key">
      <ULink :to="`/apps/${app.key}`" class="flex flex-col items-center p-4 bg-white shadow-md rounded-lg">
        <span class="mt-2">{{ app.title }}</span>
      </ULink>
    </template>
  </div>
</template>
