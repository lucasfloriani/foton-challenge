import User from '../UserModel';

import * as UserLoader from '../UserLoader';
import { UserConnection } from '../UserType';

import { mutationWithClientMutationId, toGlobalId } from 'graphql-relay';
import { GraphQLNonNull, GraphQLString } from 'graphql';

interface UserRegisterArgs {
  name: string;
  email: string;
  password: string;
}

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
    const { name, email, password } = args;

    const newUser = await new User({ name, email, password }).save();

    return {
      id: newUser._id,
      error: null,
    };
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
