const User = require('./../models/user');
const UserInfo = require('./../models/userInfo');
const Rating = require('./../models/rating');
const Movie = require('./../models/movie');
const MovieInfo = require('./../models/movieInfo');
const crypto = require('crypto');
const APIError = require('../middlewares/rest').APIError;

function md5(string) {
    return crypto.createHash('md5').update(string).digest('hex');
}

module.exports = {
    
    async signup(ctx, next) {
        let email = ctx.request.body.email || '';
        let password = ctx.request.body.password || '';
        let username = ctx.request.body.username || '';
        try {
            let hashedPassword = md5(password);
            let newUser = await User.create({
                email,
                password: hashedPassword,
                username
            });
            let newUserInfo = await UserInfo.create({ userId: newUser.id });
            ctx.rest({
                isSignup: true,
                message: 'Success!'
            });
        } catch (e) {
            let firstError = e.errors[0];
            ctx.rest({
                isSignup: false,
                message: firstError.message
            });
        }
    },

    async login(ctx, next) {
        let username = ctx.request.body.username || '';
        let password = ctx.request.body.password || '';
        let user = await User.findOne({ where: {username} });
        if (user) {
            let hashedPassword = md5(password);
            if (hashedPassword === user.password){
                ctx.session.isLogin = true;
                ctx.session.userName = user.username;
                ctx.session.userId = user.id;
                ctx.rest({
                    isLogin: true,
                    message: 'Success!'
                });
            } else {
                ctx.rest({
                    isLogin: false,
                    message: 'Password not valid!'
                });
            }
        } else {
            ctx.rest({
                isLogin: false,
                message: 'User not exists!'
            });
        }
    },

    async logout(ctx, next) {
        ctx.session.isLogin = false;
        ctx.rest({
            isLogin: false,
            message: 'Success!'
        });
    },

    async isLogin(ctx, next) {
        if (ctx.session.isLogin) {
            ctx.rest({
                isLogin: true, 
                username: ctx.session.userName
            });
        } else {
            ctx.rest({
                isLogin: false, 
                username: ''
            });
        }
    },

    async getUserInfo(ctx, next) {
        if (ctx.session.isLogin) {
            let ratings = await Rating.findAll({ where: {userId: ctx.session.userId}});
            let movieIds = ratings.map( rating => rating.movieId);
            let movies = await Movie.findAll({ where: {movieId: movieIds}});
            let rated = [];
            for (let i=0; i<movies.length; i++) {
                rated.push({imdbId: movies[i].imdbId, title: movies[i].title, rating: ratings[i].rating});
            }
            // let recommendations = [];
            // for (let i=0; i<rated.length; i++) {
            //     if (rated[i].rating >= 3) {
            //         let movieInfo = await MovieInfo.findOne({ imdbId: rated[i].imdbId });
            //         let similar = movieInfo.similar;
            //         for (let j=0; j<similar.length; j++) {
            //             let similarInfo = await MovieInfo.findOne({ imdbId: similar[j][0] });
            //             recommendations.push({imdbId: similar[j][0], title: similar[j][1], score: rated[i].rating * similarInfo.average });
            //         }
            //     }
            // }
            // recommendations.sort((a, b) => b.score - a.score);
            // recommendations = recommendations.slice(0, 10);
            let userInfo = await UserInfo.findOne({ userId: ctx.session.userId});
            ctx.rest({isLogin: true, rated: rated, recommendations: userInfo.recommendations});
        } else {
            ctx.rest({
                isLogin: false,
            });
        }
    }
}