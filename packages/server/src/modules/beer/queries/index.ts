import { connectionArgs, fromGlobalId } from 'graphql-relay';

import { GraphQLID, GraphQLString, GraphQLNonNull, GraphQLFieldConfigMap } from 'graphql';

import { GraphQLContext } from '../../../types';

import * as BeerLoader from '../BeerLoader';
import BeerType, { BeerConnection } from '../BeerType';

export default {
  beers: {
    type: GraphQLNonNull(BeerConnection.connectionType),
    args: {
      ...connectionArgs,
      search: {
        type: GraphQLString,
      },
    },
    resolve: async (_, args, context) => await BeerLoader.loadBeers(context, args),
  },
  beer: {
    type: BeerType,
    args: {
      id: {
        type: GraphQLNonNull(GraphQLID),
      },
    },
    resolve: async (_, { id }, context) => await BeerLoader.load(context, fromGlobalId(id).id),
  },
} as GraphQLFieldConfigMap<any, GraphQLContext, any>;
