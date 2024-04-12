<script setup lang="ts">
import type { FormError } from '#ui/types'

const toaster = useToast()
const router = useRouter()

const form = reactive({
  login: undefined,
  password: undefined,
})

function validate(): FormError[] {
  const errors = []
  if (!form.login)
    errors.push({ path: 'login', message: "Обовʼязкове поле" })
  if (!form.password)
    errors.push({ path: 'password', message: "Обовʼязкове поле" })
  return errors
}

async function onSubmit() {
  try {
    const cookie = useCookie('sraka')
    const data = await $api<{ access_token: string }>('/auth/login', {
      method: 'POST',
      body: form
    })
    cookie.value = data?.access_token
      await nextTick()
    router.push('/admin')
  } catch(e) {
    toaster.add({
      description: 'Логін або пароль неправильні',
      title: 'Помилка'
    })
  }
}
</script>

<template>
  <div class="w-full md:w-1/2 mx-auto">
    <UForm
      :validate="validate"
      :state="form"
      class="space-y-4"
      @submit="onSubmit"
    >
      <UFormGroup
        label="Логін"
        name="email"
        required
      >
        <UInput v-model="form.login" />
      </UFormGroup>

      <UFormGroup
        label="Пароль"
        name="password"
        required
      >
        <UInput
          v-model="form.password"
          type="password"
        />
      </UFormGroup>

      <UButton
        type="submit"
        size="lg"
      >
        Ввійти
      </UButton>
    </UForm>


    <UNotifications />
  </div>
</template>
