import type { Component } from 'vue'
import type { Props } from '~/types/utils'

export const useModalStore = defineStore('modal', () => {
  const configs = ref<{
    component: Component
    props?: Record<string, any>
    options?: { onClose?: () => void }
  }[]>([])

  function open<T extends Component>(component: T, props?: Props<T>, options?: { onClose?: () => void }) {
    configs.value.push({
      component: markRaw(component),
      props,
      options,
    })
  }

  function close() {
    const config = configs.value.pop()
    config?.options?.onClose?.()
  }

  return {
    configs,
    open,
    close,
  }
})
