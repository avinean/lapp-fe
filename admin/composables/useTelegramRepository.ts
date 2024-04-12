import type { TelegramEntity } from '~/types/entities'

export const useTelegramRepository = createGlobalState(() => {
  function get() {
    return $api<TelegramEntity[]>(`/telegram`)
  }

  function add(body: Partial<TelegramEntity>) {
    return $api(`/telegram`, {
      method: 'POST',
      body,
    })
  }

  function edit(id: number, body: Partial<TelegramEntity>) {
    return $api(`/telegram/${id}`, {
      method: 'PUT',
      body,
    })
  }

  return {
    get,
    add,
    edit,
  }
})
