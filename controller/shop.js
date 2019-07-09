
//Model Data
const Product = require('../models/products');
const Cart = require('../models/cart')
//Get Products All
exports.getProductShop = function (req, res, next) {
    //Ham Static khong can tao doi tuong moi
    //=========User LowDB===================
    const products = Product.fetchAll();
    res.render('./shop/product-shop', { products: products, title: 'SHOP', activeShop: 'active' });

    //=========User My SQL===================
    // Product.fetchAll()
    //     .then(([rows, fieldData]) => {
    //         console.log(rows);
    //         console.log(fieldData)
    //         const products = rows;
    //         res.render('./shop/product-shop', { products: products, title: 'SHOP', activeShop: 'active' });

    //     })
    //     .catch(err => console.log(err));
}
exports.getProductListDeTail = function (req, res, next) {
    //Ham Static khong can tao doi tuong moi
    const products = Product.fetchAll();
    res.render('./shop/product-list-detail', { products: products, title: 'Products', activeProducts: 'active' });
}
//Get Product Detail
exports.getProductDetail = function (req, res, next) {
    const product = Product.findOneProduct(req.params.productId);
    res.render('./shop/product-detail', { product: product, title: product.title, activeProducts: 'active' });
}

//-------------------------------CART------------------------------
//shop/cart--> POST
//Them product vao cart
exports.postCart = function (req, res, next) {
    const productId = req.body.productId;
    const product = Product.findOneProduct(productId);
    const cardItem = new Cart(product.productId, product.title, product.urlImage, product.price, product.description)
    cardItem.save();

    res.redirect('/shop/cart');

}
//Giao dien cart
////shop/cart--> GET (navigation)
exports.getCart = function (req, res, next) {
    //=========User LowDB===================

    const productsCart = Cart.fetchAll();
    const totalPrice = Cart.getTotalPrice();
    res.render('./shop/cart', { productsCart: productsCart, totalPrice: totalPrice, title: 'Cart', activeCart: 'active' });
    //=========User My SQL===================
    //  Cart.fetchAll()
    //  .then(([rows,fieldData])=>{
    //      const productsCart=rows;
    //      const totalPrice = Cart.getTotalPrice();
    //      res.render('./shop/cart', { productsCart: productsCart, totalPrice: totalPrice, title: 'Cart', activeCart: 'active' });

    //  });

}
//Delete product from cart
exports.deleteProductFromCart = function (req, res, next) {
    const productId = req.body.productId;
    Cart.deleteProductFormCart(productId)
    res.redirect('/shop/cart');
}

//------------------------------------------------------------
exports.orders = function (req, res, next) {
    const products = Product.fetchAll();
    res.render('./shop/orders', { products: products, title: 'Orders', activeOrder: 'active' });
}
exports.checkout = function (req, res, next) {
    const products = Product.fetchAll();
    res.render('./shop/checkout', { products: products, title: 'Checkout', activeCheckout: 'active' });
}
