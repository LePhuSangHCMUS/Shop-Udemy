const ObjectID = require('mongodb').ObjectID;
const Schema = require('mongoose').Schema
const Model = require('mongoose').model;
const  UserSchema = new Schema({
    emai: {
        type:String,
        required:true
    },
    username: {
        type:String,
        required:true
    }
});

module.exports=Model('user',UserSchema);
