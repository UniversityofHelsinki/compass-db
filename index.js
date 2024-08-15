import 'dotenv/config';
import database from "./services/database.js";
import { fileURLToPath } from 'url';
import * as path from "node:path";
import { dirname } from 'path';
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const createTables = fs.readFileSync(path.resolve(__dirname, "./sql/createTables.sql"), "utf8");

await database.query(createTables);
