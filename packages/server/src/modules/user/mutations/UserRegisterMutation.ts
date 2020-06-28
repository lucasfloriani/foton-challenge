import { mutationWithClientMutationId, toGlobalId } from 'graphql-relay';

import { GraphQLNonNull, GraphQLString } from 'graphql';

import Yup from 'yup';

import User from '../UserModel';

import * as UserLoader from '../UserLoader';
import { UserConnection } from '../UserType';

interface UserRegisterArgs {
  name: string;
  email: string;
  password: string;
}

const validateRegister = Yup.object<UserRegisterArgs>()
  .shape<UserRegisterArgs>({
    name: Yup.string()
      .typeError('Nome precisa ser um texto')
      .required('Nome é obrigatório'),
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
  name: 'UserRegister',
  inputFields: {
    name: {
      type: GraphQLNonNull(GraphQLString),
    },
    email: {
      type: GraphQLNonNull(GraphQLString),
    },
    password: {
      type: GraphQLNonNull(GraphQLString),
    },
  },
  mutateAndGetPayload: async (args: UserRegisterArgs) => {
    try {
      const { name, email, password } = await validateRegister.validate(args);
      const newUser = await new User({ name, email, password }).save();
      return { id: newUser._id, error: null };
    } catch (err) {
      return { id: null, error: err instanceof Yup.ValidationError ? err.errors : err };
    }
  },
  outputFields: {
    userEdge: {
      type: UserConnection.edgeType,
      resolve: async ({ id }, _, context) => {
        const newUser = await UserLoader.load(context, id);

        // Returns null if no node was loaded
        if (!newUser) {
          return null;
        }

        return {
          cursor: toGlobalId('User', newUser._id),
          node: newUser,
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
