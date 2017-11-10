const router = require('koa-router')();
const apiRouter = require('./apiRouter');

router.get('/', async (ctx, next) => {
    await ctx.render('index')
});

module.exports = router;