import type { NavigationEntity } from '~/types/cms'

export const useNavigationRepository = createGlobalState(() => {
  function get() {
    return $api<NavigationEntity>(`/navigation`)
  }

  function edit(id: number, body: Partial<NavigationEntity>) {
    return $api(`/navigation/${id}`, {
      method: 'PUT',
      body,
    })
  }

  return {
    get,
    edit,
  }
})
