import {  APIGatewayProxyEvent, Context } from 'aws-lambda';
import { createServer, proxy } from 'aws-serverless-express';
import { Server } from 'http'
import * as dotenv from 'dotenv';
import { App } from './app';

let cachedServer: Server


dotenv.config();

async function main() {

  const expressApp = new App();


  return createServer(expressApp.app);

}

export const hello = (event: APIGatewayProxyEvent, context: Context) => {
  if (!cachedServer) {
    main().then(server => {
      cachedServer = server;
      if (
        event.body &&
        event.headers['Content-Type']?.includes('multipart/form-data')
      ) {    
        event.body = (Buffer.from(event.body, 'binary') as unknown) as string;
      }
      return proxy(server, event, context);
    });
  } else {
    if (
      event.body &&
      event.headers['Content-Type']?.includes('multipart/form-data')
    ) {
  
      event.body = (Buffer.from(event.body, 'binary') as unknown) as string;
    }

    return proxy(cachedServer, event, context);
  }
};

