import bcrypt from 'bcrypt';

import { mutationWithClientMutationId, toGlobalId } from 'graphql-relay';

import { GraphQLNonNull, GraphQLString } from 'graphql';

import Yup from 'yup';

import User from '../UserModel';
import { UserConnection } from '../UserType';

import { GraphQLContext } from '../../../types';

import { createTokens } from '../helpers/auth';

interface UserLoginArgs {
  email: string;
  password: string;
}

const validateLogin = Yup.object<UserLoginArgs>()
  .shape<UserLoginArgs>({
    email: Yup.string()
      .typeError('E-mail precisa ser um texto')
      .email('E-mail é inválido')
      .required('E-mail é obrigatório'),
    password: Yup.string()
      .typeError('Senha precisa ser um texto')
      .min(5, 'Senha precisa ter no mínimo 5 caracteres')
      .required('Senha é obrigatório'),
  })
  .required();

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
    const { email, password } = await validateLogin.validate(args);

    // TODO: Check if this can be put in dataloader
    const user = await User.findOne({ email });
    if (!user) {
      return { error: 'Usuário não encontrado' };
    }

    const valid = await bcrypt.compareSync(password, user.password);
    if (!valid) {
      return { error: 'Senha incorreta' };
    }

    const { refreshToken, accessToken } = createTokens(user);

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
