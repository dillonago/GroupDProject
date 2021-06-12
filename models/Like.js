const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
    user_1: {
        type: mongoose.Schema.Types.ObjectId, 
        required: true, 
        max: 100,
        min: 4
    }, 
    user_2: {
        type: mongoose.Schema.Types.ObjectId, 
        required: true, 
        max: 100,
        min: 4
    }, 
    response: {
        type: Boolean, 
        required: true
    }
});

module.exports = mongoose.model('Like', likeSchema);