import { mutationWithClientMutationId, toGlobalId } from 'graphql-relay';

import { GraphQLNonNull, GraphQLString, GraphQLInt, GraphQLList, GraphQLFloat, GraphQLID } from 'graphql';

import Yup from 'yup';

import { FileUpload, GraphQLUpload } from 'graphql-upload';

import { uploadFile } from '../../../helpers/file';

import Beer from '../BeerModel';

import * as BeerLoader from '../BeerLoader';
import { BeerConnection } from '../BeerType';

interface BeerAddArgs {
  user: string;
  name: string;
  image: FileUpload;
  description: string;
  bitterness: number;
  coloring: number;
  volumetry: string;
  style: string;
  idealTemperature: number[];
  // idealTemperature: [number, number];
  alcoholContent: number;
}

const validateAdd = Yup.object<BeerAddArgs>()
  .shape<BeerAddArgs>({
    user: Yup.string()
      .typeError('Identificador fornecido do usuário é inválido')
      .required('Identificador do usuário é obrigatório'),
    name: Yup.string()
      .typeError('Nome precisa ser um texto')
      .required('Nome é obrigatório'),
    image: Yup.object<FileUpload>()
      .shape({
        mimetype: Yup.string()
          .typeError('Imagem só pode ser do tipo jpg, jpeg ou png')
          .matches(/image\/.*/, 'Tipo do arquivo não suportado, precisa ser do tipo jpg, jpeg ou png')
          .required('Imagem é obrigatória'),
      })
      .required(),
    description: Yup.string()
      .typeError('Descrição precisa ser um texto')
      .required('Descrição é obrigatório'),
    bitterness: Yup.number()
      .typeError('Amargor precisa ser um número')
      .integer('Amargor precisa ser um número inteiro')
      .min(0, 'Amargor precisa ser maior ou igual à 0')
      .required('Amargor é obrigatório'),
    coloring: Yup.number()
      .typeError('Coloração da cerveja precisa ser um número')
      .integer('Coloração da cerveja precisa ser um número inteiro')
      .min(0, 'Coloração da cerveja precisa ser maior ou igual à 0')
      .required('Coloração da cerveja é obrigatória'),
    volumetry: Yup.string()
      .typeError('Volumetria precisa ser um texto')
      .required('Volumetria é obrigatório'),
    style: Yup.string()
      .typeError('Estilo precisa ser um texto')
      .required('Estilo é obrigatório'),
    idealTemperature: Yup.array<[number, number]>()
      .of(
        Yup.number()
          .typeError('O valor da temperatura ideal precisa ser um número')
          .integer('O valor da temperatura ideal precisa ser um inteiro')
          .required('O valor da temperatura ideal é obrigatório'),
      )
      .max(2, 'Temperatura ideal precisa ser no máximo 2 valores')
      .min(2, 'Temperatura ideal precisa ser no mínimo 2 valores')
      .required('Temperatura ideal é obrigatório'),
    alcoholContent: Yup.number()
      .typeError('Graduação Alcóolica precisa ser um número')
      .min(0, 'Graduação Alcóolica precisa ser igual ou maior que zero')
      .max(100, 'Graduação Alcóolica precisa ser menor ou igual a 100%')
      .required('Graduação Alcóolica é obrigatório'),
  })
  .required();

const mutation = mutationWithClientMutationId({
  name: 'BeerAdd',
  inputFields: {
    user: {
      type: GraphQLNonNull(GraphQLID),
    },
    name: {
      type: GraphQLNonNull(GraphQLString),
    },
    image: {
      type: GraphQLNonNull(GraphQLUpload),
    },
    description: {
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
    try {
      const {
        user,
        name,
        image,
        description,
        bitterness,
        coloring,
        volumetry,
        style,
        idealTemperature,
        alcoholContent,
      } = await validateAdd.validate(args);

      const newBeer = await new Beer({
        user,
        name,
        description,
        image: await uploadFile(image),
        bitterness,
        coloring,
        volumetry,
        style,
        idealTemperature,
        alcoholContent,
      }).save();

      return { id: newBeer._id, error: null };
    } catch (err) {
      return { id: null, error: err instanceof Yup.ValidationError ? err.errors : err };
    }
  },
  outputFields: {
    beerEdge: {
      type: BeerConnection.edgeType,
      resolve: async ({ id }, _, context) => {
        const newBeer = await BeerLoader.load(context, id);

        // Returns null if no node was loaded
        if (!newBeer) {
          return null;
        }

        return {
          cursor: toGlobalId('Beer', id),
          node: newBeer,
        };
      },
    },
    error: {
      type: GraphQLString, // TODO: Refactor type to return also an array
      resolve: ({ error }) => error,
    },
  },
});

export default {
  ...mutation,
};
