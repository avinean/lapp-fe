import { VisibilityStatus } from '~/types/enums'

export const useGlobalStore = defineStore('global', () => {
  const isLoggedIn = ref(false)
  const isPreview = ref(false)
  const statuses = computed(() => isPreview.value
    ? [VisibilityStatus.Published, VisibilityStatus.Draft]
    : [VisibilityStatus.Published],
  )
  const breadcrumbs = ref<({ label: string, to: string } | { label: string })[]>([])

  const headerRef = ref<Element | ComponentPublicInstance | null>(null)

  async function checkLogin() {
    if (isLoggedIn.value)
      return isLoggedIn.value
    try {
      await $api('/auth/me')
      isLoggedIn.value = true
    }
    catch (e) {
      isLoggedIn.value = false
    }
    return isLoggedIn.value
  }

  return {
    checkLogin,
    isLoggedIn,
    isPreview,
    statuses,
    headerRef,
    breadcrumbs,
  }
})
