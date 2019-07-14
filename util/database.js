

// Connection URL
const url = 'mongodb+srv://PhuSang:Nu06081995@cluster0-qjak0.mongodb.net/Shop?retryWrites=true&w=majority';

//=======================MONGOOSE=================
var mongoose = require('mongoose');
module.exports = function mongooseConnect() {
    return mongoose.connect(url, { useNewUrlParser: true });
}