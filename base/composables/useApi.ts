import type { AsyncDataOptions } from 'nuxt/app'
import type { FetchOptions } from 'ohmyfetch'

export function useApi<T>(url: string, opts?: FetchOptions, apiOptions?: AsyncDataOptions<T>) {
  return useAsyncData(
    url,
    () => $api<T>(url, opts),
    apiOptions,
  )
}
