
//Model Data
const Product = require('../models/products');

exports.getProductList = function (req, res, next) {
    const user = req.user;
    console.log(req.user)
    Product.fetchAllProductUser(user._id)
        .then(products => {
            res.render('./shop/product-shop', { products: products, title: 'SHOP', activeShop: 'active' });
        })

}