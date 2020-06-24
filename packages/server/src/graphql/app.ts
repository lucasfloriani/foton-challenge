import { GraphQLContext } from '../types';

import authMiddleware from './middlewares/authMiddleware';
import corsMiddleware from './middlewares/corsMiddleware';
import dataloadersMiddleware from './middlewares/dataloadersMiddleware';
import errorMiddleware from './middlewares/errorMiddleware';
import fileMiddleware from './middlewares/fileMiddleware';
import secureCookiesMiddleware from './middlewares/secureCookiesMiddleware';

import { schema } from './schema';

import { koaPlayground } from 'graphql-playground-middleware';
import Koa, { Context } from 'koa';
import bodyParser from 'koa-bodyparser';
import convert from 'koa-convert';
import graphqlHttp, { OptionsData } from 'koa-graphql';
import koaLogger from 'koa-logger';
import cookie from 'koa-cookie';
import Router from '@koa/router';

const app = new Koa<any, Context>();
if (process.env.NODE_ENV === 'production') {
  app.proxy = true;
}

const router = new Router<any, Context>();

// if production than trick cookies library to think it is always on a secure request
if (process.env.NODE_ENV === 'production') app.use(secureCookiesMiddleware);
if (process.env.NODE_ENV !== 'test') app.use(koaLogger());
app.use(bodyParser());
app.use(cookie());
app.use(authMiddleware);
app.use(errorMiddleware);
app.use(corsMiddleware);
app.use(dataloadersMiddleware);

router.all('/graphql', fileMiddleware);
router.all('/playground', koaPlayground({ endpoint: '/graphql' }));
router.all(
  '/graphql',
  convert(
    graphqlHttp(
      async (request, ctx, koaContext: unknown): Promise<OptionsData> => {
        const { dataloaders } = koaContext;
        const { appversion, appbuild, appplatform } = request.header;

        if (process.env.NODE_ENV !== 'test') {
          // eslint-disable-next-line no-console
          console.info('Handling request', {
            appversion,
            appbuild,
            appplatform,
          });
        }

        return {
          graphiql: process.env.NODE_ENV === 'development',
          schema,
          rootValue: {
            request: ctx.req,
          },
          context: {
            dataloaders,
            appplatform,
            koaContext,
          } as GraphQLContext,
          extensions: ({ document, variables, result }) => {
            // if (process.env.NODE_ENV === 'development') {
            //   if (document) {
            //     // eslint-disable-next-line no-console
            //     console.log(print(document));
            //     // eslint-disable-next-line no-console
            //     console.log(variables);
            //     // eslint-disable-next-line no-console
            //     console.log(JSON.stringify(result, null, 2));
            //   }
            // }
            return null as any;
          },
          formatError: (error: any) => {
            if (error.path || error.name !== 'GraphQLError') {
              // eslint-disable-next-line no-console
              console.error(error);
            } else {
              // eslint-disable-next-line no-console
              console.log(`GraphQLWrongQuery: ${error.message}`);
            }

            if (error.name && error.name === 'BadRequestError') {
              ctx.status = 400;
              ctx.body = 'Bad Request';
              return {
                message: 'Bad Request',
              };
            }

            // eslint-disable-next-line no-console
            console.error('GraphQL Error', { error });

            return {
              message: error.message,
              locations: error.locations,
              stack: error.stack,
            };
          },
        };
      },
    ),
  ),
);

app.use(router.routes()).use(router.allowedMethods());

export default app;
