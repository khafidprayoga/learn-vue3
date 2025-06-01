export default defineEventHandler(async (_event) => {
  const config = useRuntimeConfig()
  
  // apiSecret hanya bisa diakses di server
  const secret = config.apiSecret
  
  return {
    message: 'API Secret berhasil diakses di server',
    // Jangan pernah mengembalikan secret ke client!
    hasSecret: !!secret
  }
}) 