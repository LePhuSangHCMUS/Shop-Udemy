
//Model Data
const Product = require('../models/products');

exports.getProductList = function (req, res, next) {
    //Ham Static khong can tao doi tuong moi
    // Product.findAll()
    //     .then(products => {
    //         res.render('./index/index', { products: products, title: 'Home', activeShop: 'active' });
    //     })
    //     .catch(err => console.log(err))
    const user = req.user;
    user.getProducts()
        .then(products => {
            console.log(products)
            res.render('./index/index', { products: products, title: 'Home', activeShop: 'active' });
        })
        .catch(err => console.log(err));
}