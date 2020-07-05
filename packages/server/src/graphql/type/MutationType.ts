import { GraphQLObjectType } from 'graphql';

import BeerMutations from '../../modules/beer/mutations';
import UserMutations from '../../modules/user/mutations';

export default new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    ...BeerMutations,
    ...UserMutations,
  }),
});
