import type { CategoryEntity } from '~/types/entities'

export const useCategoryRepository = createGlobalState(() => {
  function get(query: { statuses?: string }) {
    return $api<CategoryEntity[]>(`/category`, { query })
  }

  function getOne(categoryIdOrSlug: number | string) {
    return $api<CategoryEntity>(`/category/${categoryIdOrSlug}`)
  }

  function add(body: Partial<CategoryEntity>) {
    return $api(`/category`, {
      method: 'POST',
      body,
    })
  }

  function edit(id: number, body: Partial<CategoryEntity>) {
    return $api(`/category/${id}`, {
      method: 'PUT',
      body,
    })
  }

  function remove(id: number) {
    return $api(`/category/delete/${id}`, { method: 'POST' })
  }

  function publish(id: number) {
    return $api(`/category/${id}/publish`, { method: 'PUT' })
  }

  function draft(id: number) {
    return $api(`/category/${id}/draft`, { method: 'PUT' })
  }

  function archive(id: number) {
    return $api(`/category/${id}/archive`, { method: 'PUT' })
  }

  return {
    get,
    getOne,
    add,
    edit,
    publish,
    draft,
    archive,
    remove,
  }
})
