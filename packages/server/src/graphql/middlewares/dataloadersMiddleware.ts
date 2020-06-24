import * as loaders from '../../loader';

import { getDataloaders } from '../helper';

export default function dataloadersMiddleware(ctx, next) {
  ctx.dataloaders = getDataloaders(loaders);
  return next();
}
