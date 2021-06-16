const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String, 
        max: 100,
        min: 4
    }, 
    email: {
        type: String, 
        min: 6, 
        max: 200
    }, 
    password: {
        type: String, 
        max: 1024, 
        min: 6
    },
    date: {
        type: Date, 
        default: Date.now
    },
    phone: {
        type: String, 
        default: ""
    },
    zip: {
        type: String, 
        default: ""
    }
});

module.exports = mongoose.model('User', userSchema);