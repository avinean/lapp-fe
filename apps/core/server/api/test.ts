export default defineEventHandler(async (event) => {
  return {
    status: 200,
    body: {
      message: 'Hello from core!',
    },
  }
})
