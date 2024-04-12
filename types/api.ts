export interface PaginationRequest {
  search?: string | Ref<string>
  page?: number | Ref<number>
  take?: number | Ref<number>
}

export interface PaginationResponse<T> {
  items: T[]
  pages: number
}