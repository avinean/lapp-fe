<script setup lang="ts">
import type { CategoryEntity, TelegramEntity } from '~/types/entities'

const toast = useToast()
const { get, add, edit } = useTelegramRepository()
const { data, refresh } = useAsyncData(() => get())

const loading = ref()
const contact = ref<Partial<TelegramEntity> | null>(null)
const edittingId = ref<number | null>(null)

function callAddEdit(preset?: Partial<TelegramEntity>) {
  edittingId.value = preset?.id || null
  contact.value = {
    region: preset?.region || undefined,
    botApiKey: preset?.botApiKey || undefined,
    userIds: preset?.userIds || undefined,
    link: preset?.link || undefined,
  }
}

async function onCreateOrUpdate() {
  loading.value = true

  try {
    if (edittingId.value)
      await edit(edittingId.value, contact.value!)
    else
      await add(contact.value!)
    refresh()
    contact.value = null
    edittingId.value = null
  }
  catch (error: any) {
    toast.add({
      title: 'Не вдалось додати/змінити контакт',
      description: error.message,
    })
  }
  finally {
    loading.value = false
  }
}

function validate(state: TelegramEntity) {
  const errors = []

  if (!state.region)
    errors.push({ path: 'region', message: 'Обовʼязкове поле' })
  if (!state.botApiKey)
    errors.push({ path: 'botApiKey', message: 'Обовʼязкове поле' })
  if (!state.userIds)
    errors.push({ path: 'userIds', message: 'Обовʼязкове поле' })
  if (!state.link)
    errors.push({ path: 'link', message: 'Обовʼязкове поле' })

  return errors
}
</script>

<template>
  <div>
    <UCard>
      <template #header>
        <div class="flex justify-between">
          <span class="text-2xl">Телеграм</span>
          <UButton icon="i-heroicons-folder-plus-16-solid" @click="callAddEdit()">
            Додати телеграм
          </UButton>
        </div>
      </template>

      <UForm
        v-if="contact"
        :state="contact"
        :validate="validate"
        class="grid grid-cols-4 gap-2"
        @submit="onCreateOrUpdate"
      >
        <UFormGroup name="region" label="Регіон">
          <USelectMenu
            v-model="contact.region"
            :options="data?.map(({ region }) => region).filter(Boolean) || []"
            searchable
            creatable
          >
            <template #option-create="{ option }">
              <span class="flex-shrink-0">Додати новий регіон:</span>
              <span class="block truncate">{{ option }}</span>
            </template>
          </USelectMenu>
        </UFormGroup>
        <UFormGroup name="botApiKey" label="Ключ бота">
          <UInput v-model="contact.botApiKey" />
        </UFormGroup>
        <UFormGroup name="link" label="Посилання">
          <UInput v-model="contact.link" />
        </UFormGroup>
        <UFormGroup name="userIds" label="ID користувачів">
          <InputTags v-model="contact.userIds" />
        </UFormGroup>
        <div class="col-span-4 flex justify-center p-2">
          <UButton :loading="loading" type="submit" class="mx-auto">
            Зберегти
          </UButton>
        </div>
      </UForm>
      <UTable
        v-if="data"
        :rows="data"
        :columns="[
          { key: 'region', label: 'Регіон' },
          { key: 'botApiKey', label: 'Ключ бота' },
          { key: 'link', label: 'Посилання на бот' },
          { key: 'userIds', label: 'ID користувачів' },
          { key: 'actions', label: 'Дії' },
        ]"
      >
        <template #botApiKey-data="{ row }">
          <div class="truncate w-36">{{ row.botApiKey }}</div>
        </template>
        <template #link-data="{ row }">
          <a :href="row.link" target="_blank">{{ row.link }}</a>
        </template>
        <template #actions-data="{ row }">
          <UDropdown
            :items="[
              [
                {
                  label: 'Редагувати',
                  icon: 'i-heroicons-pencil-square-16-solid',
                  click: () => callAddEdit(row),
                },
              ],
            ]"
          >
            <UButton color="gray" variant="ghost" icon="i-heroicons-adjustments-horizontal-solid" />
          </UDropdown>
        </template>
      </UTable>
    </UCard>

    <UCard>
      <h2 class="text-xl">
        Створення конфігурації
      </h2>
      <UAccordion
        :items="[
          {
            label: 'Створення бота',
            slot: 'create-bot',
          },
          {
            label: 'Отримання ідентифікаторів користувачів',
            slot: 'get-user-info',
          },
          {
            label: 'Отримання повідомлень в телеграм',
            slot: 'get-messages',
          },
        ]"
      >
        <template #create-bot>
          <div>
            <h3 class="text-lg font-bold">
              Створення бота
            </h3>
            <ul class="list-decimal px-6">
              <li>Знайти бота <a href="https://t.me/botfather">BotFather</a></li>
              <li>
                Написати <UBadge color="gray">
                  /newbot
                </UBadge>
              </li>
              <li>Ввести назву бота</li>
              <li>Ввести імʼя користувача бота</li>
              <li>Отримати ключ бота</li>
              <img src="/create_bot.png" alt="створення бота" width="300">
            </ul>
          </div>
        </template>
        <template #get-user-info>
          <div>
            <h3 class="text-lg font-bold">
              Отримання ідентифікаторів користувачів
            </h3>
            <ul class="list-decimal px-6">
              <li>Користувач має перейти в <a href="https://t.me/userinfobot">цього бота</a></li>
              <li>
                Написати <UBadge color="gray">
                  /start
                </UBadge>
              </li>
              <li>У відповідь прийде повідомлення з `id`</li>
              <img src="/get_user_info.png" alt="створення бота" width="300">
            </ul>
          </div>
        </template>
        <template #get-messages>
          <div>
            <h3 class="text-lg font-bold">
              Отримання повідомлень в телеграс
            </h3>
            <ul class="list-decimal px-6">
              <li>Виконати попередні дві інструкції</li>
              <li>Коли в базу додано запис з ключем бота і ідентифікаторами користувачів кожен з цих користувачів має дати дозвіл боту надсилати повідомлення</li>
              <li>
                Кожен з користувачів має зайти за посиланням чат бота і натиснути кнопку <UBadge color="gray">
                  /start
                </UBadge>
              </li>
              <img src="/start_bot.png" alt="створення бота" width="300">
            </ul>
          </div>
        </template>
      </UAccordion>
    </UCard>
  </div>
</template>