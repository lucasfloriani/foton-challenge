import { DataLoaderKey, GraphQLContext } from '../../types';

import { escapeRegex } from '../../common/utils';

import BeerModel, { IBeer } from './BeerModel';

import { connectionFromMongoCursor, mongooseLoader } from '@entria/graphql-mongoose-loader';
import DataLoader from 'dataloader';
import { ConnectionArguments } from 'graphql-relay';
import { Types } from 'mongoose';

export default class Beer {
  id: string;
  _id: string;
  name: string;
  description: string;
  image: string;
  bitterness: number;
  coloring: number;
  volumetry: string;
  style: string;
  idealTemperature: [number, number]; // 3ºC A 5ºC
  alcoholContent: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: IBeer) {
    this.id = data.id || data._id;
    this._id = data._id;
    this.name = data.name;
    this.description = data.description;
    this.image = data.image;
    this.bitterness = data.bitterness;
    this.coloring = data.coloring;
    this.volumetry = data.volumetry;
    this.style = data.style;
    this.idealTemperature = data.idealTemperature;
    this.alcoholContent = data.alcoholContent;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}

const viewerCanSee = () => true;

export const getLoader = () => new DataLoader<DataLoaderKey, IBeer>(ids => mongooseLoader(BeerModel, ids as any));

export const load = async (context: GraphQLContext, id: DataLoaderKey) => {
  if (!id) {
    return null;
  }

  try {
    const data = await context.dataloaders.BeerLoader.load(id);

    if (!data) {
      return null;
    }

    return viewerCanSee() ? new Beer(data) : null;
  } catch (err) {
    return null;
  }
};

export const clearCache = ({ dataloaders }: GraphQLContext, id: Types.ObjectId) =>
  dataloaders.BeerLoader.clear(id.toString());

export const primeCache = ({ dataloaders }: GraphQLContext, id: Types.ObjectId, data: IBeer) =>
  dataloaders.BeerLoader.prime(id.toString(), data);

export const clearAndPrimeCache = (context: GraphQLContext, id: Types.ObjectId, data: IBeer) =>
  clearCache(context, id) && primeCache(context, id, data);

interface LoadBeerArgs extends ConnectionArguments {
  search?: string;
}

export const loadBeers = async (context: GraphQLContext, args: LoadBeerArgs) => {
  const conditions: any = {};

  if (args.search) {
    const searchRegex = new RegExp(`${escapeRegex(args.search)}`, 'ig');
    conditions.$or = [{ name: { $regex: searchRegex } }, { description: { $regex: searchRegex } }];
  }

  return connectionFromMongoCursor({
    cursor: BeerModel.find(conditions).sort({ date: 1 }),
    context,
    args,
    loader: load,
  });
};
