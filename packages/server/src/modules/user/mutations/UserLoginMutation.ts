import User from '../UserModel';
import { UserConnection } from '../UserType';

import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from '../../../common/config';

import { GraphQLContext } from '../../../types';

import bcrypt from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { mutationWithClientMutationId, toGlobalId } from 'graphql-relay';
import { GraphQLNonNull, GraphQLString } from 'graphql';

interface UserLoginArgs {
  email: string;
  password: string;
}

const mutation = mutationWithClientMutationId({
  name: 'UserLogin',
  inputFields: {
    email: {
      type: GraphQLNonNull(GraphQLString),
    },
    password: {
      type: GraphQLNonNull(GraphQLString),
    },
  },
  mutateAndGetPayload: async (args: UserLoginArgs) => {
    const { email, password } = args;

    // TODO: Check if this can be put in dataloader
    const user = await User.findOne({ email });
    if (!user) {
      return { error: 'Usuário não encontrado' };
    }

    const valid = await bcrypt.compareSync(password, user.password);
    if (!valid) {
      return { error: 'Senha incorreta' };
    }

    const refreshToken = sign({ userId: user._id, name: user.name }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
    const accessToken = sign({ userId: user.id }, ACCESS_TOKEN_SECRET, { expiresIn: '15min' });

    return {
      refreshToken,
      accessToken,
      user,
      error: null,
    };
  },
  outputFields: {
    userEdge: {
      type: UserConnection.edgeType,
      resolve: async ({ user, refreshToken, accessToken }, _, context: GraphQLContext) => {
        context.koaContext.cookies.set('refresh-token', refreshToken);
        context.koaContext.cookies.set('access-token', accessToken);

        return {
          cursor: toGlobalId('User', user._id),
          node: user,
        };
      },
    },
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error,
    },
  },
});

export default {
  ...mutation,
};
