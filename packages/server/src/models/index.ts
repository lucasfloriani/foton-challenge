import Beer from '../modules/beer/BeerModel';
import Event from '../modules/event/EventModel';
import User from '../modules/user/UserModel';

import mongoose from 'mongoose';

mongoose.Promise = global.Promise;

export { Beer, Event, User };
