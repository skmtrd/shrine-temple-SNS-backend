import 'dotenv/config'
import { serve } from '@hono/node-server'
import { app } from './app'
import { env } from './config/env'

console.log(`🔥 Shrine Temple SNS API is running on http://${env.HOSTNAME}:${env.PORT}`)
console.log(`📚 API Docs: http://localhost:${env.PORT}/docs`)

serve({
  fetch: app.fetch,
  port: env.PORT,
  hostname: env.HOSTNAME,
})
