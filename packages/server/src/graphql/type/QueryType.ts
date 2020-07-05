import { globalIdField } from 'graphql-relay';

import { GraphQLObjectType } from 'graphql';

import { NodeField, NodesField } from '../../interface/NodeInterface';

import { GraphQLContext } from '../../types';

import BeerQueries from '../../modules/beer/queries';
import UserQueries from '../../modules/user/queries';

export default new GraphQLObjectType<any, GraphQLContext, any>({
  name: 'Query',
  description: 'The root of all... queries',
  fields: () => ({
    id: globalIdField('Query'),
    node: NodeField,
    nodes: NodesField,

    ...BeerQueries,
    ...UserQueries,
  }),
});
