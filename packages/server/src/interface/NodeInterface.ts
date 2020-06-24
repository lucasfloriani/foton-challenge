import Event, * as EventLoader from '../modules/event/EventLoader';
import EventType from '../modules/event/EventType';
import Beer, * as BeerLoader from '../modules/beer/BeerLoader';
import BeerType from '../modules/beer/BeerType';
import User, * as UserLoader from '../modules/user/UserLoader';
import UserType from '../modules/user/UserType';
import { GraphQLContext } from '../types';

import { nodeDefinitions } from './node';

import { fromGlobalId } from 'graphql-relay';

const { nodeField, nodesField, nodeInterface } = nodeDefinitions(
  // A method that maps from a global id to an object
  async (globalId, context: GraphQLContext) => {
    const { id, type } = fromGlobalId(globalId);

    if (type === 'Event') {
      return EventLoader.load(context, id);
    } else if (type === 'Beer') {
      return BeerLoader.load(context, id);
    } else if (type === 'User') {
      return UserLoader.load(context, id);
    }

    // it should not get here
    return null;
  },
  // A method that maps from an object to a type
  obj => {
    if (obj instanceof Event) {
      return EventType;
    } else if (obj instanceof Beer) {
      return BeerType;
    } else if (obj instanceof User) {
      return UserType;
    }

    // it should not get here
    return null;
  },
);

export const NodeInterface = nodeInterface;
export const NodeField = nodeField;
export const NodesField = nodesField;
