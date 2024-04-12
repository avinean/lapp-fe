import type { BrandEntity } from '~/types/entities'
import type { BrandType } from '~/types/enums'

export const useBrandRepository = createGlobalState(() => {
  function get(query?: { statuses?: string, type?: BrandType, categories?: string }) {
    return $api<BrandEntity[]>('/brand', { query })
  }

  function add(body: Partial<BrandEntity>) {
    return $api('/brand', {
      method: 'POST',
      body,
    })
  }

  function edit(id: number, body: Partial<BrandEntity>) {
    return $api(`/brand/${id}`, {
      method: 'PUT',
      body,
    })
  }

  function remove(id: number) {
    return $api(`/brand/delete/${id}`, { method: 'POST' })
  }

  function publish(id: number) {
    return $api(`/brand/${id}/publish`, { method: 'PUT' })
  }

  function draft(id: number) {
    return $api(`/brand/${id}/draft`, { method: 'PUT' })
  }

  function archive(id: number) {
    return $api(`/brand/${id}/archive`, { method: 'PUT' })
  }

  return {
    get,
    add,
    edit,
    publish,
    draft,
    archive,
    remove,
  }
})
