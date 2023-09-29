import { FeathersError } from '@feathersjs/errors'
import { FeathersKoaContext } from '@feathersjs/koa'
import { app } from './app'
import send from 'koa-send'

export const errorHandler = () => async (ctx: FeathersKoaContext, next: () => Promise<any>) => {
  try {
    await next()

    if (ctx.body === undefined) {
      ctx.response.status = 200
      await send(ctx, '/index.html', { root: app.get('public') })
    }
  } catch (error: any) {
    ctx.response.status = error instanceof FeathersError ? error.code : 500
    ctx.body =
      typeof error.toJSON === 'function'
        ? error.toJSON()
        : {
            message: error.message
          }
  }
}
