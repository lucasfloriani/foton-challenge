import { verify } from 'jsonwebtoken';

import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from '../../common/config';

import User from '../../modules/user/UserModel';

import { createTokens } from '../../modules/user/helpers/auth';

export default async function authMiddleware(ctx, next) {
  const accessToken = ctx.cookie['access-token'];
  const refreshToken = ctx.cookie['refresh-token'];
  if (!refreshToken && !accessToken) {
    return next();
  }

  try {
    const data = verify(accessToken, ACCESS_TOKEN_SECRET) as any;
    (ctx.request as any).userId = data.userId;
    return next();
  } catch {}

  if (!refreshToken) {
    return next();
  }

  let data;

  try {
    data = verify(refreshToken, REFRESH_TOKEN_SECRET) as any;
  } catch {
    return next();
  }

  const user = await User.findOne(data.userId);
  // token has been invalidated
  if (!user) {
    return next();
  }

  const tokens = createTokens(user);

  ctx.cookies.set('refresh-token', tokens.refreshToken);
  ctx.cookies.set('access-token', tokens.accessToken);
  (ctx.request as any).userId = user.id;

  next();
}
