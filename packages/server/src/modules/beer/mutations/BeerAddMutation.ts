import Beer from '../BeerModel';

import * as BeerLoader from '../BeerLoader';
import { BeerConnection } from '../BeerType';

import { mutationWithClientMutationId, toGlobalId } from 'graphql-relay';
import { GraphQLNonNull, GraphQLString, GraphQLInt, GraphQLList, GraphQLFloat } from 'graphql';

interface BeerAddArgs {
  name: string;
  description: string;
  image: string;
  bitterness: number;
  coloring: number;
  volumetry: string;
  style: string;
  idealTemperature: [number, number];
  alcoholContent: number;
  createdAt: Date;
  updatedAt: Date;
}

const mutation = mutationWithClientMutationId({
  name: 'BeerAdd',
  inputFields: {
    name: {
      type: GraphQLNonNull(GraphQLString),
    },
    description: {
      type: GraphQLNonNull(GraphQLString),
    },
    image: {
      type: GraphQLNonNull(GraphQLString),
    },
    bitterness: {
      type: GraphQLNonNull(GraphQLInt),
    },
    coloring: {
      type: GraphQLNonNull(GraphQLInt),
    },
    volumetry: {
      type: GraphQLNonNull(GraphQLString),
    },
    style: {
      type: GraphQLNonNull(GraphQLString),
    },
    idealTemperature: {
      type: GraphQLNonNull(GraphQLList(GraphQLNonNull(GraphQLInt))),
    },
    alcoholContent: {
      type: GraphQLNonNull(GraphQLFloat),
    },
  },
  mutateAndGetPayload: async (args: BeerAddArgs) => {
    const { name, description, image, bitterness, coloring, volumetry, style, idealTemperature, alcoholContent } = args;

    const newBeer = await new Beer({
      name,
      description,
      image,
      bitterness,
      coloring,
      volumetry,
      style,
      idealTemperature,
      alcoholContent,
    }).save();

    return {
      id: newBeer._id,
      error: null,
    };
  },
  outputFields: {
    eventEdge: {
      type: BeerConnection.edgeType,
      resolve: async ({ id }, _, context) => {
        const newBeer = await BeerLoader.load(context, id);

        // Returns null if no node was loaded
        if (!newBeer) {
          return null;
        }

        return {
          cursor: toGlobalId('Beer', newBeer._id),
          node: newBeer,
        };
      },
    },
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error,
    },
  },
});

export default {
  ...mutation,
};
