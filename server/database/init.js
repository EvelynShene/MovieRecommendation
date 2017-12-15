// const mongoose = require('mongoose');
// const config = require('./../config');

// const Movie = require('../models/movie')
// const MovieInfo = require('../models/movieInfo');

// mongoose.connect(config.mongodb.uri, { useMongoClient: true });

// mongoose.connection.on('connected', function() {
//     console.log('Mongoose connection open to ' + config.mongodb.uri);

//     Movie.findAll({
//       attributes: ['movieId', 'imdbId', 'title']
//     }).then(movies => {
//         // console.log(movies.title);
//         // let movieArray = [];

//         for (let i in movies) {
//             MovieInfo.create({
//                 movieId: movies[i].movieId,
//                 imdbId: movies[i].imdbId,
//                 title: movies[i].title
//             }, function(err, records) {
//                 if(err) {
//                     console.log(err);
//                 } else {
//                     console.log("Done");
//                 }
//             });
//             // movieArray.push({
//             //     movieId: movies[i].movieId,
//             //     imdbId: movies[i].imdbId,
//             //     title: movies[i].title
//             // });       
//         }
//     });

    
// });

// // Movie.findAll({
// //   attributes: ['movieId', 'imdbId', 'title']
// // }).then(movies => {
// //     // console.log(movies.title);
// //     let movieArray = []
// //     for (let i in movies) {
// //         movieArray.push({
// //             movieId: movies[i].movieId,
// //             imdbId: movies[i].imdbId,
// //             title: movies[i].title
// //         });       
// //     }
// // });



// // const model = require('../models/rating.js');

// // const UserInfo = require('../models/userInfo');
// // model.sync().then(() => {
// //     console.log('init db ok.');
// //     process.exit(0);
// // });

// // MovieInfo.create({ movieId: 1, imdbId: 'tt123'});
// // MovieInfo.findOne({imdbId: 'tt123'} , function(err, character) {
// //     console.log(err);
// //     console.log(character); // { name: 'Frodo', inventory: { ringOfPower: 1 }}
// // });

// // UserInfo.create({ userId: 1 });




