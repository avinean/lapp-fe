import type { PageEntity } from '~/types/cms'
import type { VisibilityStatus } from '~/types/enums'

export const usePageRepository = createGlobalState(() => {
  function get() {
    return $api<PageEntity[]>(`/page`)
  }

  function getOne(slug: string) {
    return $api<PageEntity>(`/page/${slug}`)
  }

  function add(body: Partial<PageEntity>) {
    return $api(`/page`, {
      method: 'POST',
      body,
    })
  }

  function edit(id: number, body: Partial<PageEntity>) {
    return $api(`/page/${id}`, {
      method: 'PUT',
      body,
    })
  }

  function publish(id: number) {
    return $api(`/page/${id}/publish`, { method: 'PUT' })
  }

  function draft(id: number) {
    return $api(`/page/${id}/draft`, { method: 'PUT' })
  }

  function archive(id: number) {
    return $api(`/page/${id}/archive`, { method: 'PUT' })
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
