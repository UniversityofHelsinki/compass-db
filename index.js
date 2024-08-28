import 'dotenv/config';
import express from 'express';
import database from "./services/database.js";
import { fileURLToPath } from 'url';
import * as path from "node:path";
import { dirname } from 'path';
import fs from "fs";
import bodyParser from "body-parser";
import helmet from "helmet";
import compression from "compression";
import routes from './api/routes.js';

const app = express();
const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ipaddress = process.env.AZURE_NODEJS_IP || '127.0.0.1';

app.use(compression());
app.use(helmet());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

database.query('SELECT NOW()', (err, res) => {
    console.log(err ? "errors: " + err : 'Postgres client connected ' , res.rows[0]);
});

const createTables = fs.readFileSync(path.resolve(__dirname, "./sql/createTables.sql"), "utf8");

await database.query(createTables);

// Specify the port to listen on
const port = 8000;

app.use('/api', router);
routes(router);

// Start the server
app.listen(port, ipaddress, () => {
    console.log(`Node.js HTTP server is running on port ${port} and ip address ${ipaddress}`);
});
