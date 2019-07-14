
const ObjectID = require('mongodb').ObjectID;
const Schema = require('mongoose').Schema;
const Model=require('mongoose').model;
const ProductSchema = new Schema({
    userId:{
        type:ObjectID,
        required:true,
        ref:'user'
    },
    title: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
});
module.exports = Model('product',ProductSchema);
