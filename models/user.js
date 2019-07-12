const getDb = require('../util/database').getDb;
ObjectID = require('mongodb').ObjectID;
const Order = require('./order');
const Cart = require('./cart')
module.exports = class User {
    constructor(email, username, _id) {
        this.email = email;
        this.username = username;
        this._id = _id ? _id : new ObjectID();
    }

    save() {
        // Get the documents collection
        const db = getDb();
        const collection = db.collection('users');
        // Insert some documents
        try {
            return collection.insertOne(this)
                .then(result => {
                    console.log("Insert One User Document");
                    // db.close();
                })
                .catch(err => {
                    console.log(err)
                });
        } catch (err) {
            console.log("Insert User Wrong")
        }


    }
    addOrder() {
        this.orderId = new ObjectID();
        console.log(this.order);
        try {
            return Cart.fetchAllCart(this._id)
                .then(productsCart => {
                    const order = new Order(this.orderId, productsCart,this._id);
                    order.save();
                })
        } catch (err) {
            console.log(err);
        }

    }
    getOrders(){
        const db = getDb();
        const collection = db.collection('orders');
        return collection.find({userId:this._id})
        .toArray();
    }
    static findOneUser(userId) {
        const db = getDb();
        const collection = db.collection('users');
        // Insert some documents
        return collection.findOne({ _id: new ObjectID(userId) })

    }

}