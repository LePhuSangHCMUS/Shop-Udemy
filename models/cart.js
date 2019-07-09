// //============================LOW DB=======================================
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json');
const db = low(adapter);
// Set some defaults (required if your JSON file is empty)
db.defaults({ carts: [] })
    .write()
//=========================MY SQL===================================
// const dbMysql = require('../util/database');


module.exports = class Cart {
    constructor(productId, title, urlImage, price, description) {
        this.productId = productId;
        this.title = title;
        this.description = description;
        this.price = price;
        this.urlImage = urlImage;
        this.quantity = 1;
    }
    //========================USER LOWDB=============================
    save() {
        //Tim neu da ta trung thi khong add them vao cart
        const product = db.get('carts').find({ 'productId': this.productId }).value();
        //Neu tim thay thì khong them 
        if (product) {
        db.get('carts').find({ 'productId': this.productId }).assign({ quantity:product.quantity+1}).write();

            return;
        }
        //neu khong tim thay thi add product vao cart
        db.get('carts')
            .push(this)
            .write()
    }
    static fetchAll() {
        const products = db.get('carts').value();
        return products;
    }
    static findOneProductFormCart(productId) {
        const product = db.get('carts').find({ productId: productId }).value();
        return product;
    }
    //Get totatl Price cart
    static getTotalPrice(){
        const productsCart=db.get('carts').value();
        return productsCart.reduce((totalPrice,product)=>{
            return totalPrice+parseFloat(product.price)*parseInt(product.quantity);
        },0)
    }
    //Dung de remove cart hoac admin xoa san pham thi cung xoa luon trong cart
    static deleteProductFormCart(productId) {
        db.get('carts').remove({ productId: productId }).write();

    }
    // //========================USER MYSQL=============================
    // save() {
    //     //Tim neu da ta trung thi khong add them vao cart

    //     // const sql = 'SELECT * FROM carts WHERE productId = ?';
    //     // dbMysql.execute(sql, [this.productId])
    //     //     .then(([rows, fieldData]) => {
    //             // const product = rows;
    //             const sql = 'INSERT INTO carts VALUES (?,?,?,?,?,?)';
    //             return dbMysql.execute(sql, [this.productId, this.title, this.urlImage, this.description, this.price, this.quantity])//Tra ve 1 promise

    //             // const sql = SqlString.format("UPDATE carts SET quantity=? WHERE productId =?", [(product[0].quantity+1) , productId]);
    //             // console.log(sql);
    //             // return dbMysql.execute(sql)//Tra ve 1 promise
    //         // })
    //         // .catch();//Tra ve 1 promise


    // }
    // static fetchAll() {
    //     const sql = 'SELECT * FROM carts';
    //     return dbMysql.execute(sql)//Tra ve 1 promise
    // }
    // static findOneProductFormCart(productId) {
    //     const product = db.get('carts').find({ productId: productId }).value();
    //     return product;
    // }
    // //Get totatl Price cart
    // static getTotalPrice() {
    //     const productsCart = db.get('carts').value();
    //     return productsCart.reduce((totalPrice, product) => {
    //         return totalPrice + parseFloat(product.price) * parseInt(product.quantity);
    //     }, 0)
    // }
    // //Dung de remove cart hoac admin xoa san pham thi cung xoa luon trong cart
    // static deleteProductFormCart(productId) {
    //     var sql = 'DELETE FROM `carts` WHERE `productId` = ?';
    //     return dbMysql.execute(sql, [productId])//Tra ve 1 promise
    // }

}