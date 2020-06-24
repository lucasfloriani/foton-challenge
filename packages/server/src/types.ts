/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/array-type */

import { IBeer } from './modules/beer/BeerModel';
import { IEvent } from './modules/event/EventModel';
import { IUser } from './modules/user/UserModel';

import DataLoader from 'dataloader';
import { Types } from 'mongoose';
import { Context } from 'koa';

export type DataLoaderKey = Types.ObjectId | string | undefined | null;

export interface GraphQLDataloaders {
  BeerLoader: DataLoader<DataLoaderKey, IBeer>;
  EventLoader: DataLoader<DataLoaderKey, IEvent>;
  UserLoader: DataLoader<DataLoaderKey, IUser>;
}

export interface GraphQLContext {
  dataloaders: GraphQLDataloaders;
  appplatform: string;
  koaContext: Context;
}
