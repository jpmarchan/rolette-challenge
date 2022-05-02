import express, {Application} from 'express';
import 'reflect-metadata';
import morgan from 'morgan';
import indexRouter from './routes/index.routes';
import cors from 'cors';
import * as dynamoose from 'dynamoose';
import { ddb_config } from '../src/connection/DynamoDBClient';

export class App {
    public app: Application


    constructor(private port?: number | string) {//we initialize all instances in respective order
        this.app = express()
        this.cors()
        this.setings()
        this.middlewares()
        this.routes()
        this.dynamose()
        this.body()
    }

    setings(){ // identify port by local or environment variable
        this.app.set('port', this.port || process.env.PORT || 3000)
    }

    middlewares(){ // middleware configuration
        this.app.use(morgan('dev'))
        
    }
    routes(){ // route configuration 
        this.app.use(indexRouter)
    }
    
    cors(){// we configure cors
         const corsOptions = {
            origin: "*",
            credentials: false,
            methods: ["GET", "PUT", "POST", "DELETE", "ANY"],
            allowedHeaders: ['Content-Type', 'client-id', 'client-hash', 'Access-Control-Allow-Headers', 'Access-Control-Allow-Origin','Auth'],
        }
        this.app.use(cors(corsOptions));
    }
    body(){ 
        this.app.use(express.json())
        this.app.use(express.urlencoded({extended: false}))
    }


    dynamose(){// we use dynamose configuration
        this.dynamo();
    }
    

    async listent() {// we listen on the port configured in the .env
        this.app.listen(this.app.get('port'))
    }

    private dynamo() { // the connection is created with the dynamoose library by setting the credentials configured in the file /src/connection/DynamoDBClient
        const conn = new dynamoose.aws.sdk.DynamoDB(ddb_config);
        dynamoose.aws.ddb.set(conn);

      }

} 
