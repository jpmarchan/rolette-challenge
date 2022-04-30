import express, {Application} from 'express';
import 'reflect-metadata';
import morgan from 'morgan';
import indexRouter from './routes/index.routes';
import cors from 'cors';
import * as dynamoose from 'dynamoose';
import { ddb_config } from '../src/connection/DynamoDBClient';

export class App {
    public app: Application


    constructor(private port?: number | string) {//inicializamos todas las instancias en orden respectivo
        this.app = express()
        this.cors()
        this.setings()
        this.middlewares()
        this.routes()
        this.dynamose()
        this.body()
    }

    setings(){ // identificar puerto por variable de entorno o local
        this.app.set('port', this.port || process.env.PORT || 3000)
    }

    middlewares(){ // onfiguracion de middlewares
        this.app.use(morgan('dev'))
        
    }
    routes(){ // configuracion de rutas
        this.app.use(indexRouter)
    }
    
    cors(){// configuramos cors
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


    dynamose(){// utilizamos configuracion de dynamose
        this.dynamo();
    }
    

    async listent() {// escuchamos en el puerto configurado en el .env
        this.app.listen(this.app.get('port'))
        console.log('Server on port', this.app.get('port'))
    }

    private dynamo() { // se crea la conexion con con la libreria dynamoose seteando las credenciales configuradas en el archivo /src/connection/DynamoDBClient
        const conn = new dynamoose.aws.sdk.DynamoDB(ddb_config);
        dynamoose.aws.ddb.set(conn);

      }

} 
