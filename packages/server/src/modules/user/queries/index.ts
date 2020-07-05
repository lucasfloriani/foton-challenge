import { connectionArgs, fromGlobalId } from 'graphql-relay';

import { GraphQLID, GraphQLString, GraphQLNonNull, GraphQLFieldConfigMap } from 'graphql';

import { GraphQLContext } from '../../../types';

import * as UserLoader from '../UserLoader';
import UserType, { UserConnection } from '../UserType';

export default {
  users: {
    type: GraphQLNonNull(UserConnection.connectionType),
    args: {
      ...connectionArgs,
      search: {
        type: GraphQLString,
      },
    },
    resolve: async (_, args, context) => await UserLoader.loadUsers(context, args),
  },
  user: {
    type: UserType,
    args: {
      id: {
        type: GraphQLNonNull(GraphQLID),
      },
    },
    resolve: async (_, { id }, context) => await UserLoader.load(context, fromGlobalId(id).id),
  },
} as GraphQLFieldConfigMap<any, GraphQLContext, any>;
