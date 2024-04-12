import type { ApplicationEntity } from '~/types/entities'

export const useApplicationRepository = createGlobalState(() => {
  function get() {
    return $api<ApplicationEntity[]>('/application')
  }

  function add(body: Partial<ApplicationEntity>) {
    return $api('/application', {
      method: 'POST',
      body,
    })
  }

  function edit(id: number, body: Partial<ApplicationEntity>) {
    return $api(`/application/${id}`, {
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
