import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { compressFilter, addItemSchema, sellItemSchema } from './utils';
import ItemController from './controller/itemController';
import { schemaValidator } from './middleware';
import { env } from './config';
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');

const app: Express = express();

app.use(
  cors({
    // origin is given a array if we want to have multiple origins later
    origin: [env.CORS_ORIGIN],
    credentials: true,
  })
);

// parse application/json
app.use(express.json())

// Helmet is used to secure this app by configuring the http-header
app.use(helmet());

// Compression is used to reduce the size of the response body
app.use(compression({ filter: compressFilter }));

// Swagger docs
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Item endpoints
app.post("/:item/add", schemaValidator(addItemSchema), ItemController.addItem);
app.post("/:item/sell", schemaValidator(sellItemSchema), ItemController.sellItem);
app.get("/:item/quantity", ItemController.getItemQuantity);

export default app;
