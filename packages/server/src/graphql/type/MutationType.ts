import BeerMutations from '../../modules/beer/mutations';
import EventMutations from '../../modules/event/mutations';
import UserMutations from '../../modules/user/mutations';

import { GraphQLObjectType } from 'graphql';

export default new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    ...BeerMutations,
    ...EventMutations,
    ...UserMutations,
  }),
});
