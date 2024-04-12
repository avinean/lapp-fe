import type { ParameterEntity } from '~/types/entities'

type Value = string
interface Unit {
  unit: string
  values: Value[]
}
interface Type {
  type: string
  units: Unit[]
}

export const useParameterRepository = createGlobalState(() => {
  function get() {
    return $api<ParameterEntity[]>('/parameter')
  }

  function suggestions() {
    return $api<Type[]>('/parameter/suggestions')
  }

  function add(body: Partial<ParameterEntity>) {
    return $api('/parameter', {
      method: 'POST',
      body,
    })
  }

  function edit(id: number, body: Partial<ParameterEntity>) {
    return $api(`/parameter/${id}`, {
      method: 'PUT',
      body,
    })
  }

  function remove(id: number) {
    return $api(`/parameter/delete/${id}`, { method: 'POST' })
  }

  return {
    get,
    suggestions,
    add,
    edit,
    remove,
  }
})
