const path = require('path');

const Koa = require('koa');

const bodyParser = require('koa-bodyparser');

const static = require('koa-static')

const rest = require('./middlewares/rest');

const views = require('koa-views');

const router = require('./routes/router')

const app = new Koa();

const isProduction = process.env.NODE_ENV === 'production';

// log request URL:
app.use(async(ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    var
        start = new Date().getTime(),
        execTime;
    await next();
    execTime = new Date().getTime() - start;
    ctx.response.set('X-Response-Time', `${execTime}ms`);
});

// parse request body:
app.use(bodyParser());

app.use(views(path.join(__dirname, './views'), {
    extension: 'ejs'
}))

// bind .rest() for ctx:
app.use(rest.restify());

// add routes:
app.use(router.routes()).use(router.allowedMethods())

// static file support:
app.use(static(
    path.join(__dirname, './public')
))

const port = 8080;
app.listen(port);
console.log('app started at port 8080...');