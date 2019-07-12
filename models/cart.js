const getDb = require('../util/database').getDb;
ObjectID = require('mongodb').ObjectID;
module.exports = class Cart {
    constructor(userId, producId, title) {
        this.userId = userId;
        this.productId = new ObjectID(producId);
        this.quantity = 1;
    }

    save() {
        // Get product  the documents collection
        //Neu Ton Tai product thi tang quantity len thoi
        const db = getDb();
        const collection = db.collection('carts');
        return collection.find({ productId: this.productId, userId: this.userId }).toArray()
            .then(cart => {
                //Neu Tim san pham khong ton tai trong cart thi them moi
                console.log(cart)
                if (cart.length === 0) {
                    try {

                        //Them moi san pham
                        return collection.insertOne(this)
                            .then(result => {
                                console.log("Insert  New Cart");
                            })
                            .catch(err => {
                                console.log(err)
                            });
                    } catch (err) {
                        console.log(err);
                        console.log('Insert New Cart Wrong');
                    }
                }
                ///Neu tim thay thi tang quantity len
                else {
                    const newQuantity = cart[0].quantity + 1;
                    return collection.updateOne(
                        { productId: this.productId, userId: this.userId }
                        , {
                            $set: { quantity: newQuantity }
                        })



                }
            })


    }
    static fetchAllCart(userId) {
        // Get the documents collection
        const db = getDb();
        const collection = db.collection('carts');
        //Tim nhung itemcart cos user id trung voi userId ban dau
        return collection.find({ userId: userId })
            .toArray()
            .then(carts => {
                //Mang idProduct in cart
                const productIds = carts.map(cart => {
                    return cart.productId;
                })

                ///Tim nhieu product trong cart
                const collection = db.collection('products');
                return collection.find(
                    {
                        _id: {
                            $in: productIds
                        }
                    })
                    .toArray()
                    .then(productsCart => {
                        return productsCart.map(product => {
                            ///find la method cu mang
                            return {
                                ...product,
                                //Tim quantity ung vowi productId trong card
                                quantity: carts.find(cart => {
                                    //Do la doi tuong ne khong so sanh === duco nen chuyen ve string
                                    return cart.productId.toString() === product._id.toString();
                                }).quantity
                            }


                        })
                    })
            }
            )
    }


    static deleteProductFromCartUserIdAndProductId(userId,productCartId){
        const db = getDb();
        const collection = db.collection('carts');
        // Insert some documents
        try{
            return collection.deleteOne({ productId:new ObjectID(productCartId),userId:userId })
        }catch(err){
            console.log("Not Delete Cart")
            console.log(err)
        }
    }

}