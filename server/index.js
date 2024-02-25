const express = require('express');
const config = require('./configs');
const routes = require('./routes/index.routes');
const { Server } = require("socket.io");
const { createServer } = require("http");
const { closeIdleConnections } = require('./base/closeConnect');
const { createTables } = require('./db/migrations/createTables.js');
const { runSeeds } = require('./db/seeds/runSeeds.js');


const PORT = config.development.server.port ?? process.env.NODE_ENV ?? 8000;

const app = express();

const httpServer = createServer(app);

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization, authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
});


app.use(express.json());
app.use(express.urlencoded({ extended: false}))
app.use(express.static(__dirname + '/../public', {index: false}));

app.use('/api', routes);

app.get('*', (req, res) => {
    res.sendFile('/client/public/index.html', {root: __dirname + '/..'});
});

const io = new Server(httpServer, {
    cors: {
        origin: ["http://localhost:3000", "http://localhost:8000"],
        methods: ['GET', 'POST'],
    }
});
require('./socket.js')(io);


function startApp() {
    try {
        httpServer.listen(PORT, () => console.log("SERVER STARTED ON PORT " + PORT))
        setTimeout(async () => {
            await createTables();
            await runSeeds();
        }, 5000);
        
    } catch (e) {
        console.log(e)
    }
}

startApp();


setInterval(
    async () => {
        await closeIdleConnections();
    },
    30000
);