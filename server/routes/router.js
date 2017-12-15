const router = require('koa-router')();
// const apiRouter = require('./apiRouter');
const userController = require('../controllers/user');
const movieController = require('../controllers/movie');

// router.get('/', async (ctx, next) => {
//     await ctx.render('index')
// });
// router.get('/movie/:id', async (ctx, next) => {
//     await ctx.render('movie')
// }););
// router.get('/user/:id', MovieController.getMovieById);
// router.use('/api', apiRouter.routes(), apiRouter.allowedMethods());
// api
router.post('/api/user/login', userController.login)
    .post('/api/user/signup', userController.signup)
    .get('/api/user/logout', userController.logout)
    .get('/api/user/login', userController.isLogin)
    .get('/api/user/info', userController.getUserInfo)
    .get('/api/movie/info', movieController.getMovieInfo)
    .post('/api/movie/rate', movieController.rate)
    .get('/api/movie/search', movieController.search)
    .get('/api/movie/picks', movieController.picks);

module.exports = router;