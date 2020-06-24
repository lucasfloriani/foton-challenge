import Beer from '../modules/beer/BeerModel';
import User from '../modules/user/UserModel';

import mongoose from 'mongoose';

mongoose.Promise = global.Promise;

export { Beer, User };
