const url = require('url');
const axios = require('axios');
const random = require("random-js")();
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
        let info = response.data;
        
        let movies = await Movie.findOrCreate({ where: {imdbId}, defaults: {title: info.Title} });
        let movieInfo = await MovieInfo.findOne({ imdbId });
        if (!movieInfo) {
            await MovieInfo.create({
                movieId: movies[0].movieId,
                imdbId: imdbId,
                title: info.Title
            });
            info.similar = [];
        } else {
            info.similar = movieInfo.similar;
        }    

        let movie = await Movie.findOne({ where: {imdbId: imdbId} });
        let ratingSum = await Rating.sum('rating', { where: {movieId: movie.movieId}});
        let ratingCount = await Rating.count( { where: {movieId: movie.movieId}});
        info.ratingCount = ratingCount;
        if (ratingCount == 0) {
            info.averageRating = 0;
        } else {
            info.averageRating = (ratingSum / ratingCount).toFixed(2);
        }
        
        if (ctx.session.isLogin) {
            let userRating = await Rating.findOne({ where: {userId: ctx.session.userId, movieId: movie.movieId}});
            if (userRating) {
                info.isRated = true;
                info.userRating = userRating.rating;
            } else {
                info.isRated = false;
            }
        }

        ctx.rest(info);
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
    
    async picks(ctx, next) {
        let randomIds = [];
        let count = await Movie.count();
        for (let i=0; i<10; i++) {
            randomIds.push(random.integer(1, count));
        }
        picks = await Movie.findAll({ where: {movieId: randomIds}});
        ctx.rest({picks});
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

            //update recommendations
            ratings = await Rating.findAll({ where: {userId: ctx.session.userId}});
            let movieIds = ratings.map( rating => rating.movieId);
            movies = await Movie.findAll({ where: {movieId: movieIds}});
            let rated = [];
            for (let i=0; i<movies.length; i++) {
                rated.push({imdbId: movies[i].imdbId, title: movies[i].title, rating: ratings[i].rating});
            }
            let recommendations = [];
            let imdbIds = [];
            for (let i=0; i<rated.length; i++) {
                if (rated[i].rating >= 3) {
                    let movieInfo = await MovieInfo.findOne({ imdbId: rated[i].imdbId });
                    let similar = movieInfo.similar;
                    for (let j=0; j<similar.length; j++) {
                        if (imdbIds.includes(similar[j][0])) continue;
                        let similarInfo = await MovieInfo.findOne({ imdbId: similar[j][0] });
                        recommendations.push({imdbId: similar[j][0], title: similar[j][1], score: rated[i].rating * similarInfo.average });
                        imdbIds.push(similar[j][0]);
                    }
                }
            }
            recommendations.sort((a, b) => b.score - a.score);
            recommendations = recommendations.slice(0, 10);
            // let userInfo = await UserInfo.findOne({ userId: ctx.session.userId });
            await UserInfo.findOneAndUpdate({ userId: ctx.session.userId }, {recommendations: recommendations});

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