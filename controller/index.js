
//Model Data
const Product = require('../models/products');

exports.getProductList = function (req, res, next) {
    const user = req.user;
    console.log(user)
    Product.find({ userId: user._id })
        .then(products => {
            console.log(products)
            res.render('./shop/product-shop', { products: products, title: 'SHOP', activeShop: 'active' });

        })
}