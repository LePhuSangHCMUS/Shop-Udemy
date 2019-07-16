const ObjectID = require('mongodb').ObjectID;
const Schema = require('mongoose').Schema
const Model = require('mongoose').model;
const  UserSchema = new Schema({
    username: {
        type:String,
        required:true
    },
    email: {
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true   
    }

});

module.exports=Model('user',UserSchema);
