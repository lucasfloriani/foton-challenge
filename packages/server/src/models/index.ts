import mongoose from 'mongoose';

import Beer from '../modules/beer/BeerModel';
import User from '../modules/user/UserModel';

mongoose.Promise = global.Promise;

export { Beer, User };
