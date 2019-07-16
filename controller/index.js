
//Model Data
const Product = require('../models/products');

exports.getProductList = function (req, res, next) {

    
    Product.find()
        .then(products => {
            console.log(products)
            res.render('./shop/product-shop', { products: products, title: 'SHOP', activeShop: 'active' });

        })
}