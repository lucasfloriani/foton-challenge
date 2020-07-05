import { connectionFromMongoCursor, mongooseLoader } from '@entria/graphql-mongoose-loader';
import DataLoader from 'dataloader';
import { ConnectionArguments } from 'graphql-relay';
import { Types } from 'mongoose';

import { escapeRegex } from '../../common/utils';
import { DataLoaderKey, GraphQLContext } from '../../types';

import UserModel, { IUser } from './UserModel';

export default class User {
  id: string;
  _id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: IUser) {
    this.id = data.id || data._id;
    this._id = data._id;
    this.name = data.name;
    this.email = data.email;
    this.password = data.password;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}

const viewerCanSee = () => true;

export const getLoader = () => new DataLoader<DataLoaderKey, IUser>(ids => mongooseLoader(UserModel, ids as any));

export const load = async (context: GraphQLContext, id: DataLoaderKey) => {
  if (!id) {
    return null;
  }

  try {
    const data = await context.dataloaders.UserLoader.load(id);

    if (!data) {
      return null;
    }

    return viewerCanSee() ? new User(data) : null;
  } catch (err) {
    return null;
  }
};

export const clearCache = ({ dataloaders }: GraphQLContext, id: Types.ObjectId) =>
  dataloaders.UserLoader.clear(id.toString());

export const primeCache = ({ dataloaders }: GraphQLContext, id: Types.ObjectId, data: IUser) =>
  dataloaders.UserLoader.prime(id.toString(), data);

export const clearAndPrimeCache = (context: GraphQLContext, id: Types.ObjectId, data: IUser) =>
  clearCache(context, id) && primeCache(context, id, data);

interface LoadUserArgs extends ConnectionArguments {
  search?: string;
}

export const loadUsers = async (context: GraphQLContext, args: LoadUserArgs) => {
  const conditions: any = {};

  if (args.search) {
    const searchRegex = new RegExp(`${escapeRegex(args.search)}`, 'ig');
    conditions.name = { $regex: searchRegex };
  }

  return connectionFromMongoCursor({
    cursor: UserModel.find(conditions).sort({ date: 1 }),
    context,
    args,
    loader: load,
  });
};
