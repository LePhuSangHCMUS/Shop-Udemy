

// Connection URL
const MONGODB_URI = 'mongodb+srv://PhuSang:Nu06081995@cluster0-qjak0.mongodb.net/Shop?retryWrites=true&w=majority';

//=======================MONGOOSE=================
var mongoose = require('mongoose');
module.exports = function mongooseConnect() {
    return mongoose.connect(MONGODB_URI, { useNewUrlParser: true });
}