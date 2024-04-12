export function usePhoto(name?: string) {
  const toast = useToast()
  const photo = ref()
  const url = ref<string>()

  async function add() {
    if (photo.value) {
      try {
        const body = new FormData()
        body.append('photo', photo.value)

        photo.value = null

        const endpoint = name ? `/util/photo/${encodeURIComponent(name)}` : '/util/photo'
        const method = name ? 'PUT' : 'POST'

        url.value = await $api<string>(endpoint, {
          method,
          body,
        })

        return url.value
      }
      catch (e) {
        toast.add({
          title: 'Error',
          description: 'Не вдалось завантажити фото',
        })
      }
    }
  }

  return {
    photo,
    url,
    add,
  }
}
