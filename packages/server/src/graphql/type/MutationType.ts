import BeerMutations from '../../modules/beer/mutations';
import EventMutations from '../../modules/event/mutations';

import { GraphQLObjectType } from 'graphql';

export default new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    // Event
    ...BeerMutations,
    ...EventMutations,
  }),
});
