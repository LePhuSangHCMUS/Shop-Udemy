
//Model Data
const Product = require('../models/products');
const Cart = require('../models/cart');
const User = require('../models/user')
//Get Products All
exports.getProductShop = function (req, res, next) {
    const user = req.user;
    console.log(req.user)
    Product.fetchAllProductUser(user._id)
        .then(products => {
            res.render('./shop/product-shop', { products: products, title: 'SHOP', activeShop: 'active' });
        })

}
exports.getProductListDeTail = function (req, res, next) {
    // Product.fetchAllProduct()
    //     .then(products => {
    //         res.render('./shop/product-shop', { products: products, title: 'SHOP', activeShop: 'active' });

    //     })
    const user = req.user;
    console.log(req.user)
    Product.fetchAllProductUser(user._id)
        .then(products => {
            res.render('./shop/product-shop', { products: products, title: 'SHOP', activeShop: 'active' });
        })

}
//Get Product Detail
exports.getProductDetail = function (req, res, next) {
    const productId = req.params.productId;

    Product.findOneProduct(productId)
        .then(product => {
            console.log(product)
            res.render('./shop/product-detail', { product: product, title: product.title, activeProducts: 'active' });

        });
}

//-------------------------------CART------------------------------
//shop/cart--> POST
//Them product vao cart
exports.postCart = function (req, res, next) {
    const userId = req.user._id;
    const productId = req.body.productId;
    const cart = new Cart(userId, productId);
    try {
        cart.save()
            .then(result => {
                console.log("Increase Quantity");
                res.redirect('/shop');
            })
            .catch(err => {
                console.log(err)
            });
    } catch (err) {
        console.log('Save wrong !!!!')
        console.log(err)
    }



}
//Giao dien cart
////shop/cart--> GET (navigation)
exports.getCart = function (req, res, next) {
    const useId = req.user._id;
    try {
        Cart.fetchAllCart(useId).then(productsCart => {
            console.log(productsCart);
            res.render('./shop/cart', { productsCart: productsCart, title: 'Cart', activeCart: 'active' });

        })
    } catch (err) {
        console.log(errr)
    }


}
//Delete product from cart
exports.deleteProductFromCart = function (req, res, next) {
    const user = req.user;
    const productCartId = req.body.productCartId;
    try {
        Cart.deleteProductFromCartUserIdAndProductId(user._id, productCartId).then(result => {
            console.log("Delete Success");
            res.redirect('/shop/cart');

        })
    } catch (err) {
        console.log(err);
        console.log("Not delete");
    }

}

//------------------------------------------------------------
exports.postOrders = function (req, res, next) {
    var user = req.user;

    try {
        user.addOrder()
            .then(result => {
                res.redirect('/shop/orders');
            });
    } catch (err) {
        console.log(err)
    }

}

exports.getOrders = function (req, res, next) {
    var user = req.user;

    try {
        user.getOrders()
            .then(orders=>{
                console.log(orders)
                 res.render('./shop/orders', { orders: orders, title: 'Orders', activeCheckout: 'orders' });
            })
    } catch (err) {
        console.log(err)
    }

}


// exports.checkout = function (req, res, next) {
//     const products = Product.fetchAll();
//     res.render('./shop/checkout', { products: products, title: 'Checkout', activeCheckout: 'active' });
// }