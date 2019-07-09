
//Model Data
const Product = require('../models/products');

exports.getProductList = function (req, res, next) {
    //Ham Static khong can tao doi tuong moi
    const products = Product.fetchAll();
    res.render('./index/index', { products: products, title: 'Home', activeShop: 'active' });
}