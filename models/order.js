
const ObjectID = require('mongodb').ObjectID;
const Schema = require('mongoose').Schema;
const Model = require('mongoose').model;
const OrderSchema = new Schema({
    userId: {
        type: ObjectID,
        ref:'user',
        required: true
    },
    productsCart:
        [
            {

                productId: {
                    type: ObjectID,
                    ref:'product',
                    required: true
                },
                title: {
                    type: String,
                    required: true
                },
                imageUrl:{
                    type: String,
                    required: true
                },
                description:{
                    type: String,
                    required: true  
                },
                price:{
                    type: Number,
                    required: true
                },
                quantity:{
                    type: Number,
                    required: true
                }
            }
        ]
    ,
});
module.exports = Model('order', OrderSchema);