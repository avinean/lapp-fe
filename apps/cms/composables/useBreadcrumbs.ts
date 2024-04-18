export default function useBreadcrumbs(breadcrumbs: MaybeRefOrGetter<({ label: string, to: string } | { label: string })[]>) {
  const global = useGlobalStore()
  global.breadcrumbs = toValue(breadcrumbs)
  

//   watch(() => toValue(breadcrumbs), (value) => {
//     console.log('Breadcrumbs changed _breadcrumbs', value)
//   })
}
