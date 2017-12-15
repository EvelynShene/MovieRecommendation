const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MovieInfoSchema = new Schema({
    movieId: { type: Number, required: true }, 
    imdbId: { type: String, required: true }, 
    title: { type: String, default: '' },
    // avarageRating: { type: Double, default: 0 },
    // ratingNum: { type: int, default: 0}
    similar: { type: Array,default:[] },
    posts: { type: Array, default: [] },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports=mongoose.model('MovieInfo', MovieInfoSchema);

