export default function secureCookiesMiddleware(ctx, next) {
  ctx.cookies.secure = true;
  return next();
}
