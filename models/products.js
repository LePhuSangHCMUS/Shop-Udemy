

//===================DB LOWDB=========================================
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json');
const db = low(adapter);
// Set some defaults (required if your JSON file is empty)
db.defaults({ products: [] })
    .write()
//=========================MY SQL===================================
// var SqlString = require('sqlstring');
// const dbMysql = require('../util/database');
//UUID
const uuid = require('uuid').v1
module.exports = class Product {
    constructor(title, urlImage, description, price) {
        this.productId = uuid()
        this.title = title;
        this.description = description;
        this.price = price;
        this.urlImage = urlImage;
    }
    //========================USER LOWDB=============================

    save() {
        db.get('products')
            .push(this)
            .write()
    }
    static fetchAll() {
        const products = db.get('products').value();
        return products;
    }
    static findOneProduct(productId) {
        const product = db.get('products').find({ productId: productId }).value();
        return product;
    }
    static editProduct(productId,title,urlImage,description,price){
             db.get('products').find({ productId:productId }).assign({title:title,description:description,price:price,urlImage:urlImage}).write();
    }
    static deleteProduct(productId) {
        db.get('products').remove({ productId: productId }).write();

    }
    // //========================USER MYSQL=============================
    // save() {
    //     const sql = 'INSERT INTO products VALUES (?,?,?,?,?)';
    //     return dbMysql.execute(sql, [this.productId, this.title, this.urlImage, this.description, this.price])//Tra ve 1 promise
    // }
    // static fetchAll() {
    //     const sql = 'SELECT * FROM products';
    //     return dbMysql.execute(sql)//Tra ve 1 promise
    // }
    // static findOneProduct(productId) {
    //     const sql = 'SELECT * FROM `products` WHeRE `productId`=? ';
    //     return dbMysql.execute(sql, [productId])//Tra ve 1 promise
    // }
    // static editProduct(productId, title, urlImage, description, price) {
    //     const sql = SqlString.format("UPDATE products SET ? WHERE productId =?", [{ title: title, urlImage: urlImage }, productId]);
    //     console.log(sql);
    //     return dbMysql.execute(sql)//Tra ve 1 promise

    // }
    // static deleteProduct(productId) {
    //     // var sql = 'DELETE FROM `products` WHERE `productId` = `${productId}`';
    //     // OR
    //     var sql = 'DELETE FROM `products` WHERE `productId` = ?';
    //     return dbMysql.execute(sql, [productId])//Tra ve 1 promise


    // }
}