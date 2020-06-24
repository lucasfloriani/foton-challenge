import { connectionDefinitions } from '../../graphql/connection/CustomConnectionType';

import { NodeInterface } from '../../interface/NodeInterface';

import { GraphQLContext } from '../../types';

import Beer from './BeerLoader';

import { globalIdField } from 'graphql-relay';
import {
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLObjectTypeConfig,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLFloat,
  GraphQLID,
} from 'graphql';

type ConfigType = GraphQLObjectTypeConfig<Beer, GraphQLContext>;

const BeerTypeConfig: ConfigType = {
  name: 'Beer',
  description: 'Represents Beer',
  fields: () => ({
    id: globalIdField('Beer'),
    _id: {
      type: GraphQLNonNull(GraphQLString),
      description: 'MongoDB _id',
      resolve: beer => beer._id.toString(),
    },
    user: {
      type: GraphQLNonNull(GraphQLID),
      description: 'User reference from users collection',
      resolve: beer => beer.user.toString(),
    },
    name: {
      type: GraphQLNonNull(GraphQLString),
      resolve: beer => beer.name,
    },
    description: {
      type: GraphQLNonNull(GraphQLString),
      resolve: beer => beer.description,
    },
    image: {
      type: GraphQLNonNull(GraphQLString),
      resolve: beer => beer.image,
    },
    bitterness: {
      type: GraphQLNonNull(GraphQLInt),
      resolve: beer => beer.bitterness,
    },
    coloring: {
      type: GraphQLNonNull(GraphQLInt),
      resolve: beer => beer.coloring,
    },
    volumetry: {
      type: GraphQLNonNull(GraphQLString),
      resolve: beer => beer.volumetry,
    },
    style: {
      type: GraphQLNonNull(GraphQLString),
      resolve: beer => beer.style,
    },
    idealTemperature: {
      type: GraphQLNonNull(GraphQLList(GraphQLInt)),
      resolve: beer => beer.idealTemperature,
    },
    alcoholContent: {
      type: GraphQLNonNull(GraphQLFloat),
      resolve: beer => beer.alcoholContent,
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

const BeerType = new GraphQLObjectType(BeerTypeConfig);

export const BeerConnection = connectionDefinitions({
  name: 'Beer',
  nodeType: BeerType,
});

export default BeerType;
