
const getDb = require('../util/database').getDb;

module.exports = class Order {
    //Product full and quantiti trong cart giong nhu phan get cart
    constructor(orderIdUserCreateOrder, productsCart,userId) {
        this._id = orderIdUserCreateOrder;
        this.productsCart = productsCart;
        this.userId=userId;
    }
    save() {
        const db = getDb();
        const collection = db.collection('orders');
        return collection.insertOne(this)
            .then(result => {
                console.log("Insert 1 new Order")
            })
            .catch(err => {
                console.log(err)
            })
    }
    

}
