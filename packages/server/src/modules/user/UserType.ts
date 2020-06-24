import { connectionDefinitions } from '../../graphql/connection/CustomConnectionType';

import { NodeInterface } from '../../interface/NodeInterface';

import { GraphQLContext } from '../../types';

import User from './UserLoader';

import { globalIdField } from 'graphql-relay';
import { GraphQLNonNull, GraphQLObjectType, GraphQLObjectTypeConfig, GraphQLString } from 'graphql';

type ConfigType = GraphQLObjectTypeConfig<User, GraphQLContext>;

const UserTypeConfig: ConfigType = {
  name: 'User',
  description: 'Represents User',
  fields: () => ({
    id: globalIdField('User'),
    _id: {
      type: GraphQLNonNull(GraphQLString),
      description: 'MongoDB _id',
      resolve: user => user._id.toString(),
    },
    name: {
      type: GraphQLNonNull(GraphQLString),
      resolve: user => user.name,
    },
    email: {
      type: GraphQLNonNull(GraphQLString),
      resolve: user => user.email,
    },
    createdAt: {
      type: GraphQLString,
      resolve: ({ createdAt }) => (createdAt ? createdAt.toISOString() : null),
    },
    updatedAt: {
      type: GraphQLString,
      resolve: ({ createdAt }) => (createdAt ? createdAt.toISOString() : null),
    },
  }),
  interfaces: () => [NodeInterface],
};

const UserType = new GraphQLObjectType(UserTypeConfig);

export const UserConnection = connectionDefinitions({
  name: 'User',
  nodeType: UserType,
});

export default UserType;
