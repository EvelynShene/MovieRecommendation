const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserInfoSchema = new Schema({
    userId: { type: Number, required: true }, 
    recommendations: { type: Array,default:[] },
    list: { type: Array, default: [] },
    posts: { type: Array, default: [] },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports=mongoose.model('UserInfo', UserInfoSchema);