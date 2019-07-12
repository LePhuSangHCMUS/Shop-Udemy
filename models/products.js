const getDb = require('../util/database').getDb;
ObjectID = require('mongodb').ObjectID;

module.exports = class Product {
    constructor(userId, title, imageUrl, description, price) {
        this.userId = userId;
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
    }
    save() {
        // Get the documents collection
        const db = getDb();
        const collection = db.collection('products');
        // Insert some documents
        return collection.insertOne(this)
            .then(result => {
                console.log(result);
                console.log("Insert One Product Document");
                // db.close();
            })
            .catch(err => {
                console.log(err)
            });

    }
    static fetchAllProduct() {
        // Get the documents collection
        const db = getDb();
        const collection = db.collection('products');
        // Insert some documents
        return collection.find()
            .toArray()

    }
    static fetchAllProductUser(userId) {
        // Get the documents collection
        const db = getDb();
        const collection = db.collection('products');
        // Insert some documents
        return collection.find({userId:userId})
            .toArray()

    }
    static findOneProduct(productId) {
        const db = getDb();
        const collection = db.collection('products');
        // Insert some documents
        return collection.find({ _id: new ObjectID(productId) })
            .next()
            .then(product => {
                console.log("Find One Product");
                return product;
            })
    }
    static deleteOneProduct(productId) {
        const db = getDb();
        const collection = db.collection('products');
        // Insert some documents
        return collection.deleteOne({ _id: new ObjectID(productId) })
            .then(result => {
                console.log('Deleted');
            })
            .catch(err => console.log(err))
    }
    static upDateOne(productId, title, imageUrl, description, price) {
        const db = getDb();
        const collection = db.collection('products');
        try {
            return collection.updateOne({ _id: new ObjectID(productId) }, { $set: { title: title, imageUrl: imageUrl, description: description, price: price } })
        }
        catch (e) {
            console.log(e);
            console.log("Update Wrong");
        }
        // .then(result => {
        //     console.log('Updated');
        // })
        // .catch(err => console.log(err))
    }
}