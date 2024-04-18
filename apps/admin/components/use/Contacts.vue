<script setup lang="ts">
const contactRepository = useContactRepository()
const { data } = useAsyncData(
  () => contactRepository.get({}),
)
</script>

<template>
  <div class="space-y-2 py-2">
    <ul v-if="data" class="space-y-2">
      <li v-for="contact in data" :key="contact.address" class="grid lg:grid-cols-3 items-center bg-gray-100 text-center text-lg p-2">
        <div>{{ contact.address }}</div>
        <div class="grid gap-2">
          <a
            v-for="phone in contact.phones.split(',')"
            :key="phone"
            :href="`tel:${phone}`"
          >
            {{ phone }}
          </a>
        </div>
        <div class="grid gap-2">
          <a
            v-for="email in contact.emails.split(',')"
            :key="email"
            :href="`mailto:${email}`"
          >
            {{ email }}
          </a>
        </div>
      </li>
    </ul>
  </div>
</template>
