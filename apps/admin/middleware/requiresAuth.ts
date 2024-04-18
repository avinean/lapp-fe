export default defineNuxtRouteMiddleware(async () => {
  try {
    await $api('/auth/me')
  } catch(e) {
    return navigateTo('/sign-in')
  }
})
