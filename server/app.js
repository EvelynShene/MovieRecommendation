const path = require('path');
const Koa = require('koa');
const logger = require('koa-logger');
const session = require('koa-session');
const bodyParser = require('koa-bodyparser');
const static = require('koa-static');
const send = require('koa-send');
const views = require('koa-views');

const config = require('./config')
const db = require('./database/mongodb');
const rest = require('./middlewares/rest');
const router = require('./routes/router')

const app = new Koa();

app.use(logger());

app.keys = [config.sessionKey];
app.use(session({
    key: 'USER'
}, app));

app.use(bodyParser());

app.use(static(
    path.join(__dirname, './public')
));

app.use(rest.restify());

app.use(views(path.join(__dirname, './views'), {
    extension: 'ejs'
}));

app.use(router.routes()).use(router.allowedMethods())

app.use(async (ctx) => {
  await send(ctx, './public/index.html');
})

app.listen(config.port);
console.log(`app started at port ${config.port}...`);