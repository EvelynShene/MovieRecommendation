const url = require('url');
const axios = require('axios');
const config = require('../config');
const Movie = require('./../models/movie');
const Rating = require('./../models/rating');
const UserInfo = require('./../models/userInfo');
const MovieInfo = require('./../models/movieInfo');
const imdbApi = "http://www.omdbapi.com/";

module.exports = {

    async getMovieInfo(ctx, next) {
        let params = url.parse(ctx.request.url, true).query;
        let imdbId = params.id || '';
        let response = await axios.get(imdbApi, {
            params: {
                apikey: config.omdbKey,
                i: imdbId
            }
        });
        let movieInfo = response.data;

        let movie = await Movie.findOne({ where: {imdbId: imdbId} });
        let ratingSum = await Rating.sum('rating', { where: {movieId: movie.movieId}});
        let ratingCount = await Rating.count( { where: {movieId: movie.movieId}});
        movieInfo.ratingCount = ratingCount;
        if (ratingCount == 0) {
            movieInfo.averageRating = 0;
        } else {
            movieInfo.averageRating = (ratingSum / ratingCount).toFixed(2);
        }
        
        if (ctx.session.isLogin) {
            let userRating = await Rating.findOne({ where: {userId: ctx.session.userId, movieId: movie.movieId}});
            if (userRating) {
                movieInfo.isRated = true;
                movieInfo.userRating = userRating.rating;
            } else {
                movieInfo.isRated = false;
            }
        }

        ctx.rest(movieInfo);
    },

    async search(ctx, next) {
        let params = url.parse(ctx.request.url, true).query;
        let q = params.q || '';
        let response = await axios.get(imdbApi, {
            params: {
                apikey: config.omdbKey,
                s: q
            }
        });
        ctx.rest(response.data.Search);
    },

    async rate(ctx, next) {
        if (ctx.session.isLogin) {
            let imdbId = ctx.request.body.imdbId;
            let title = ctx.request.body.title;
            let movies = await Movie.findOrCreate({ where: {imdbId}, defaults: {title} });
            let movieInfo = await MovieInfo.findOne({ imdbId });
            if (!movieInfo) {
                await MovieInfo.create({
                    movieId: movies[0].movieId,
                    imdbId: imdbId,
                    title: title
                })
            }
            let ratings = await Rating.findOrCreate({ 
                where: {
                    userId: ctx.session.userId,
                    movieId: movies[0].movieId
                }, 
                defaults: {rating: ctx.request.body.rating} 
            });
            await ratings[0].update({ rating: ctx.request.body.rating });
            ctx.rest({
                isRated: true,
                message: 'Success!'
            });
        } else {
            ctx.rest({
                isRated: false,
                message: 'User not logged in!'
            });    
        }
        
    }

    // async addList(ctx, next) {
    //     if (ctx.session.isLogin) {
    //         let imdbId = ctx.request.body.imdbId;
    //         let title = ctx.request.body.title;
    //         let movie = await User.findOrCreate({ where: {imdbId}, defaults: {title} });
    //         let userInfo = await UserInfo.findOne({ userId: ctx.session.userId });
    //         let list = userInfo.list;
    //         list.push(movie.imdbId);
    //         userInfo.update({list: list});
    //     } else {
    //         ctx.rest({
    //             isRated: false,
    //             message: 'User not logged in!'
    //         });  
    //     }
        
    // }

}