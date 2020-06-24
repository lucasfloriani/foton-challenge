export default async function errorMiddleware(ctx, next) {
  try {
    await next();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('koa error:', err);
    ctx.status = err.status || 500;
    ctx.app.emit('error', err, ctx);
  }
}
