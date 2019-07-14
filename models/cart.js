
const ObjectID = require('mongodb').ObjectID;
const Schema = require('mongoose').Schema;
const Model=require('mongoose').model;
const CartSchema = new Schema({
    userId:{
        type:ObjectID,
        ref:'user',
        required:true

    },
    productId: {
        type: ObjectID,
        ref:'product',
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
});
module.exports = Model('cart',CartSchema);