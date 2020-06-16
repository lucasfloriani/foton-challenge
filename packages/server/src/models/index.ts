import Beer from '../modules/beer/BeerModel';
import Event from '../modules/event/EventModel';

import mongoose from 'mongoose';

mongoose.Promise = global.Promise;

export { Beer, Event };
