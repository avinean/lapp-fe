import type { ColorEntity } from '~/types/entities'

export const useColorRepository = createGlobalState(() => {
  function get() {
    return $api<ColorEntity[]>('/color')
  }

  function add(body: Partial<ColorEntity>) {
    return $api('/color', {
      method: 'POST',
      body,
    })
  }

  function edit(id: number, body: Partial<ColorEntity>) {
    return $api(`/color/${id}`, {
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
