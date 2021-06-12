const mongoose = require('mongoose');

const playdateSchema = new mongoose.Schema({
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
    date: {
        type: Date, 
        required: false
    }, 
    location: {
        type: String, 
        required: false
    }
});

module.exports = mongoose.model('Playdate', playdateSchema);