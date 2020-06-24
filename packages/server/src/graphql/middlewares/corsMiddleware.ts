import convert from 'koa-convert';
import cors from 'koa-cors';

export default convert(cors({ maxAge: 86400, origin: '*' }));
