import { REFRESH_TOKEN_SECRET, ACCESS_TOKEN_SECRET } from '../../../common/config';
import { IUser } from '../UserModel';

import { sign } from 'jsonwebtoken';

export const createTokens = (user: IUser) => {
  const refreshToken = sign({ userId: user._id, name: user.name }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
  const accessToken = sign({ userId: user._id, name: user.name }, ACCESS_TOKEN_SECRET, { expiresIn: '15min' });

  return { refreshToken, accessToken };
};
