import type { ContactEntity } from '~/types/entities'

export const useContactRepository = createGlobalState(() => {
  function get(query: { statuses?: string }) {
    return $api<ContactEntity[]>(`/contact`, { query })
  }

  function add(body: Partial<ContactEntity>) {
    return $api(`/contact`, {
      method: 'POST',
      body,
    })
  }

  function edit(id: number, body: Partial<ContactEntity>) {
    return $api(`/contact/${id}`, {
      method: 'PUT',
      body,
    })
  }

  function publish(id: number) {
    return $api(`/contact/${id}/publish`, { method: 'PUT' })
  }

  function draft(id: number) {
    return $api(`/contact/${id}/draft`, { method: 'PUT' })
  }

  function archive(id: number) {
    return $api(`/contact/${id}/archive`, { method: 'PUT' })
  }

  return {
    get,
    add,
    edit,
    publish,
    draft,
    archive,
  }
})
