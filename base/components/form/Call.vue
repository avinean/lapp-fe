<script setup lang="ts">
const emit = defineEmits<{
  submit: []
}>()

const sent = ref(false)
const pending = ref(false)

const form = reactive({
  name: '',
  phone: '',
  comment: '',
})

function validate(state: typeof form) {
  const errors = []

  if (!state.name)
    errors.push({ path: 'name', message: 'Обовʼязкове поле' })
  if (!state.phone)
    errors.push({ path: 'phone', message: 'Обовʼязкове поле' })

  return errors
}

async function send() {
  pending.value = true

  try {
    await $api('/util/message', {
      method: 'POST',
      body: {
        ...form,
        comment: `${form.comment}
Запит з
${window.location.href}`,
      },
    })

    setTimeout(() => {
      nextTick(() => {
        emit('submit')
        sent.value = false
        form.name = ''
        form.phone = ''
        form.comment = ''
      })
    }, 1000)
  }
  catch (error) {
    console.error(error)
  }
  finally {
    sent.value = true
    pending.value = false
  }
}
</script>

<template>
  <UForm :state="form" :validate="validate" class="space-y-2" @submit="send">
    <UFormGroup name="name" label="Ваше ім'я">
      <UInput v-model="form.name" />
    </UFormGroup>
    <UFormGroup
      name="phone"
      label="Ваш номер телефону"
    >
      <UInput v-model="form.phone" />
    </UFormGroup>
    <UFormGroup
      name="comment"
      label="Коментар"
    >
      <UTextarea v-model="form.comment" :rows="6" />
    </UFormGroup>
    <div class="flex justify-end">
      <UButton :loading="pending" type="submit">
        Замовити консультацію
      </UButton>
    </div>
  </UForm>
</template>
