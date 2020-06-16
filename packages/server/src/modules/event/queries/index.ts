import { GraphQLContext } from '../../../types';

import * as EventLoader from '../EventLoader';
import EventType, { EventConnection } from '../EventType';

import { connectionArgs, fromGlobalId } from 'graphql-relay';
import { GraphQLID, GraphQLString, GraphQLNonNull, GraphQLFieldConfigMap } from 'graphql';

export default {
  events: {
    type: GraphQLNonNull(EventConnection.connectionType),
    args: {
      ...connectionArgs,
      search: {
        type: GraphQLString,
      },
    },
    resolve: async (_, args, context) => await EventLoader.loadEvents(context, args),
  },
  event: {
    type: EventType,
    args: {
      id: {
        type: GraphQLNonNull(GraphQLID),
      },
    },
    resolve: async (_, { id }, context) => await EventLoader.load(context, fromGlobalId(id).id),
  },
} as GraphQLFieldConfigMap<any, GraphQLContext, any>;
