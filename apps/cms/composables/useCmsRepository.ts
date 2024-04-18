import type { CmsEntity } from '~/types/cms'
import type { VisibilityStatus } from '~/types/enums'

export const useCmsRepository = createGlobalState(() => {
  function get() {
    return $api<CmsEntity[]>(`/cms`)
  }

  function getOne(slug: string, query: { statuses?: VisibilityStatus[] }) {
    return $api<CmsEntity>(`/cms/${slug}`, { query })
  }

  function add(body: Partial<CmsEntity>) {
    return $api(`/cms`, {
      method: 'POST',
      body,
    })
  }

  function edit(id: number, body: Partial<CmsEntity>) {
    return $api(`/cms/${id}`, {
      method: 'PUT',
      body,
    })
  }

  function publish(id: number) {
    return $api(`/cms/${id}/publish`, { method: 'PUT' })
  }

  function draft(id: number) {
    return $api(`/cms/${id}/draft`, { method: 'PUT' })
  }

  function archive(id: number) {
    return $api(`/cms/${id}/archive`, { method: 'PUT' })
  }

  return {
    get,
    getOne,
    add,
    edit,
    publish,
    draft,
    archive,
  }
})
