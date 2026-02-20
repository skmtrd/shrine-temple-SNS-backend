import { OpenAPIHono } from '@hono/zod-openapi'
import type { Variables } from '../types'
import { publicRoutes } from './public'
import { authRoutes } from './auth'
import { protectedRoutes } from './protected'

const app = new OpenAPIHono<{ Variables: Variables }>()

// ルートをマウント（public は /api 直下の /hello など）
app.route('/api', publicRoutes)
app.route('/api/auth', authRoutes)
app.route('/api/protected', protectedRoutes)

// ヘルスチェック
app.get('/', (c) => {
  return c.json({ message: 'Shrine Temple SNS API Server is running!' })
})

export { app as routes }
