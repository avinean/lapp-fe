import type { GalleryEntity, ParameterEntity } from '~/types/entities'

export const useGalleryRepository = createGlobalState(() => {
  function get() {
    return $api<GalleryEntity[]>('/gallery')
  }

  function add(body: Partial<GalleryEntity>) {
    return $api('/gallery', {
      method: 'POST',
      body,
    })
  }

  function edit(id: number, body: Partial<GalleryEntity>) {
    return $api(`/gallery/${id}`, {
      method: 'PUT',
      body,
    })
  }

  function remove(id: number) {
    return $api(`/parameter/delete/${id}`, { method: 'POST' })
  }

  return {
    get,
    add,
    edit,
    remove,
  }
})
