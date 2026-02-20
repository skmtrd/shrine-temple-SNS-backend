import { OpenAPIHono, createRoute } from '@hono/zod-openapi'
import type { Variables } from '../types'
import { ProtectedMeResponseSchema } from '../schemas/protected'
import { ErrorSchema } from '../schemas/common'
import { verifyAuth } from '../lib/supabase'

const app = new OpenAPIHono<{ Variables: Variables }>()

const protectedMeRoute = createRoute({
  method: 'get',
  path: '/me',
  tags: ['Protected'],
  summary: 'ユーザー情報取得（認証必須）',
  security: [{ Bearer: [] }],
  responses: {
    200: {
      description: '成功',
      content: { 'application/json': { schema: ProtectedMeResponseSchema } },
    },
    401: {
      description: '認証エラー',
      content: { 'application/json': { schema: ErrorSchema } },
    },
  },
})

app.openapi(protectedMeRoute, async (c) => {
  const authHeader = c.req.header('Authorization')
  const { user, error: authError } = await verifyAuth(authHeader)

  if (authError || !user) {
    return c.json({ error: authError || 'Unauthorized' }, 401)
  }

  return c.json(
    {
      message: 'You are authenticated!',
      user,
      timestamp: new Date().toISOString(),
    },
    200,
  )
})

export { app as protectedRoutes }
