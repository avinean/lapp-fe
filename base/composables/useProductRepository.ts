import type { PaginationRequest, PaginationResponse } from '~/types/api'
import type { ColorEntity, ParameterEntity, ProductEntity } from '~/types/entities'
import type { VisibilityStatus } from '~/types/enums'

export const useProductRepository = createGlobalState(() => {
  function get(query: {
    brands?: string
    categorySlugs?: string
    categoryIds?: string
    statuses?: string
    title: string
  } & PaginationRequest) {
    return $api<PaginationResponse<ProductEntity>>(`/product`, { query })
  }

  function getByPage(query: {
    brands?: string[]
    categories?: string[]
    statuses?: VisibilityStatus[]
    colors?: string[]
    parameters?: string[]
  } & PaginationRequest) {
    return $api<PaginationResponse<ProductEntity>>(`/product/page`, { query })
  }

  function getFilters(query: { categories?: string[] }) {
    return $api<{ colors: ColorEntity[], parameters: { label: string, items: ParameterEntity[] }[] }>(`/product/filters`, { query })
  }

  function getOne(slug: string) {
    return $api<ProductEntity>(`/product/${slug}`)
  }

  function add(body: Partial<ProductEntity>) {
    return $api(`/product`, {
      method: 'POST',
      body,
    })
  }

  function edit(id: number, body: Partial<ProductEntity>) {
    return $api(`/product/${id}`, {
      method: 'PUT',
      body,
    })
  }

  function remove(id: number) {
    return $api(`/product/delete/${id}`, { method: 'POST' })
  }

  function publish(id: number) {
    return $api(`/product/${id}/publish`, { method: 'PUT' })
  }

  function draft(id: number) {
    return $api(`/product/${id}/draft`, { method: 'PUT' })
  }

  function archive(id: number) {
    return $api(`/product/${id}/archive`, { method: 'PUT' })
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
    getByPage,
    getFilters,
  }
})
