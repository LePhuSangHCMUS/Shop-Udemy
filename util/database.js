

//=====================MONGODB====================================
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
var db;
// Connection URL
const url = 'mongodb+srv://PhuSang:Nu06081995@cluster0-qjak0.mongodb.net/test?retryWrites=true&w=majority';
const dbName = 'Shop';
// Use connect method to connect to the server
const mongoConnect = () => {
    MongoClient.connect(url)
        .then(client => {
            console.log("Connected Success !!!");
            db = client.db(dbName);
        })
        .catch(err => {
            console.log(err)
        });
}
const getDb = () => {
    if (db) {
        return db;
    }
    throw ' database not found !'
}
exports.mongoConnect = mongoConnect;
exports.getDb = getDb;

