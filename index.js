require('dotenv').config();
const express = require ('express');
const database = require ( "./services/database.js");
const { fileURLToPath } = require ( 'url');
const path = require('node:path');
const { dirname } = require ( 'path');
const fs = require ( "fs");
const bodyParser = require ( "body-parser");
const helmet = require ( "helmet");
const compression = require ( "compression");
const routes = require ( './api/routes.js');
const { logger, errorLogger } = require ( './logger.js');
const teacher = require('./api/routes/teacher.js');
const student = require('./api/routes/student.js');

const app = express();
const router = express.Router();
const teacherRouter = express.Router();
const studentRouter = express.Router();

const ipaddress = process.env.AZURE_NODEJS_IP || 'localhost';

app.use(compression());
app.use(helmet());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

database.query('SELECT NOW()', (err, res) => {
    console.log(err ? "errors: " + err : 'Postgres client connected ' , res.rows[0]);
});

const createTables = fs.readFileSync(path.resolve(__dirname, "./sql/createTables.sql"), "utf8");

database.query(createTables);

// Specify the port to listen on
const port = 8000;

app.use('/api', router);
routes(router);
router.use('/teacher', teacherRouter);
router.use('/student', studentRouter)

teacher(teacherRouter);
student(studentRouter);

// Start the server
app.listen(port, ipaddress, () => {
    logger.info(`Node.js HTTP server is running on port ${port} and ip address ${ipaddress}`);
});
