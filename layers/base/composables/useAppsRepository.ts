import type { NavigationEntity } from '~/types/cms'
import type { AppsEntity } from '~/types/entities'

export const useAppsRepository = createGlobalState(() => {
  function get<T>() {
    return $api<AppsEntity<T>>(`/apps`)
  }

  function getOne<T>(id: string) {
    return $api<AppsEntity<T>>(`/apps/${id}`)
  }

  function add(body: Partial<AppsEntity<any>>) {
    return $api(`/apps`, {
      method: 'Post',
      body,
    })
  }

  return {
    get,
    add,
    getOne,
  }
})
