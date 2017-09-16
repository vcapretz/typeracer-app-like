const Koa = require('koa');
const logger = require('koa-logger');
const cors = require('kcors');
const bodyParser = require('koa-bodyparser');

const routes = require('./routes');
const config = require('./config');
const { handleConnection } = require('./utils/io-utils');

const app = new Koa()
    .use(cors())
    .use(logger())
    .use(bodyParser())
    .use(async (ctx, next) => {
        ctx.res.io = io; // eslint-disable-line
        next();
    })
    .use(routes.routes())
    .use(routes.allowedMethods());

const server = app.listen(config.server.port);
const io = require('socket.io')(server);

io.on('connection', handleConnection(io));

module.exports = server;
