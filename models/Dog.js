const mongoose = require('mongoose');

// define our dogs model
// module.exports allows us to pass this to other files when it is called
module.exports = mongoose.model('Dog', {
   name : {type : String, default: ''},
   breed : {type : String, default: ''},
});

