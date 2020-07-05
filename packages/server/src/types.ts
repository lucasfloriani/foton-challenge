import DataLoader from 'dataloader';
import { Types } from 'mongoose';
import { Context } from 'koa';

import { IUser } from './modules/user/UserModel';
import { IBeer } from './modules/beer/BeerModel';

export type DataLoaderKey = Types.ObjectId | string | undefined | null;

export interface GraphQLDataloaders {
  BeerLoader: DataLoader<DataLoaderKey, IBeer>;
  UserLoader: DataLoader<DataLoaderKey, IUser>;
}

export interface GraphQLContext {
  dataloaders: GraphQLDataloaders;
  appplatform: string;
  koaContext: Context;
}
