<template>
  <div class="min-h-screen flex flex-col">
    <div class="border-t-1 bg-white p-2">
      <ULink to="/" class="flex gap-2 items-center">
        Admin
      </ULink>
    </div>
    <main class="flex-1 p-2">
      <NuxtPage />
    </main>
    <UNotifications />
    <ClientOnly>
      <AdminModal />
    </ClientOnly>
  </div>
</template>
