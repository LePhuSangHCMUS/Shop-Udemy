
//Model Data
const Product = require('../models/products');
const Cart = require('../models/cart');
const Order = require('../models/order');
const CartItem = require('../models/cartItem');
//Get Products All
exports.getProductShop = function (req, res, next) {
    // Product.findAll()
    //     .then(products => {
    //         res.render('./shop/product-shop', { products: products, title: 'SHOP', activeShop: 'active' });

    //     })
    //     .catch(err => console.log(err));
    const user = req.user;
    user.getProducts()
        .then(products => {
            console.log(products)
            res.render('./shop/product-shop', { products: products, title: 'SHOP', activeShop: 'active' });
        })
        .catch(err => console.log(err));

}
exports.getProductListDeTail = function (req, res, next) {
    // Product.findAll()
    //     .then(products => {
    //         res.render('./shop/product-list-detail', { products: products, title: 'Products', activeProducts: 'active' });

    //     })
    //     .catch(err => console.log(err));
    const user = req.user;
    user.getProducts()
        .then(products => {
            console.log(products)
            res.render('./shop/product-list-detail', { products: products, title: 'Products', activeProducts: 'active' });
        })
        .catch(err => console.log(err));

}
//Get Product Detail
exports.getProductDetail = function (req, res, next) {
    // const productId = req.params.productId;
    // Product.findOne({
    //     where: {
    //         id: productId
    //     }
    // })
    //     .then(product => {
    //         res.render('./shop/product-detail', { product: product, title: product.title, activeProducts: 'active' });
    //     })
    //     .catch()
    const productId = req.params.productId;
    user = req.user;
    user.getProducts({
        where: {
            id: productId
        }
    })
        .then(products => {
            // console.log(productEdit)
            //Do ti tat ca nen no ra ca mang gia tri
            res.render('./shop/product-detail', { product: products[0], title: products[0].title, activeProducts: 'active' });

        })
        .catch(err => console.log(err));
}

//-------------------------------CART------------------------------
//shop/cart--> POST
//Them product vao cart
exports.postCart = function (req, res, next) {
    // const productId = req.body.productId;
    // const product = Product.findOneProduct(productId);
    // const cardItem = new Cart(product.productId, product.title, product.urlImage, product.price, product.description)
    // cardItem.save();

    // res.redirect('/shop/cart');
    const productId = req.body.productId;
    const user = req.user;
    let fetchCart;
    let newQuantity = 1;

    user.getCart()
        .then(cart => {
            fetchCart = cart;
            return cart.getProducts({
                where: {
                    id: productId
                }
            })
        })
        .then(products => {
            let product;
            if (products.length > 0) {
                product = products[0];
            }
            if (product) {
                const oldQuantity = product.cartItem.quantity;
                newQuantity = oldQuantity + 1;
                return product;
            }
            return Product.findByPk(productId)
        })
        .then(product => {
            return fetchCart.addProduct(product, { through: { quantity: newQuantity } })
        })
        .then(() => {
            res.redirect('/shop/cart');
        })
        .catch(err => console.log(err))

    // const product = Product.findOneProduct(productId)

    // const cardItem = new Cart(product.productId, product.title, product.urlImage, product.price, product.description)
    // cardItem.save();

    // res.redirect('/shop/cart');

}
//Giao dien cart
////shop/cart--> GET (navigation)
exports.getCart = function (req, res, next) {
    //=========User My SQL===================
    //  Cart.fetchAll()
    //  .then(([rows,fieldData])=>{
    //      const productsCart=rows;
    //      const totalPrice = Cart.getTotalPrice();
    //      res.render('./shop/cart', { productsCart: productsCart, totalPrice: totalPrice, title: 'Cart', activeCart: 'active' });

    //  });
    req.user.getCart()
        .then(cart => {
            cart.getProducts()
                .then(products => {
                    res.render('./shop/cart', { productsCart: products, title: 'Cart', activeCart: 'active' });
                })
                .catch(err => console.log(err))

        })
        .catch(err => console.log(err))
    // req.user.getCart();

}
//Delete product from cart
exports.deleteProductFromCart = function (req, res, next) {
    const productId = req.body.productId;
    user = req.user;
    user.getCart()
        .then(cart => {
            return cart.getProducts({
                where: {
                    id: productId
                }
            })
        })
        .then(products => {
            const product = products[0];
            return product.cartItem.destroy();
        })
        .then(result => {
            res.redirect('/shop/cart');
        })
        .catch(err => {
            console.log(err)
        })

}

//------------------------------------------------------------
exports.orders = function (req, res, next) {
    // let fetchCart;
    req.user
        .getCart()
        .then(cart => {
            // fetchCart = cart;
            return cart.getProducts();
        })
        .then(products => {
            return req.user.createOrder()
                .then(order => {
                    order.addProducts(products.map(product=>{
                        product.orderItem={quantity:product.cartItem.quantity};
                        return product;
                    }))
                })
                .catch(err => console.log(err))
        })

        .then(result => {
            res.redirect('/shop/orders');

        })
        .catch(err => console.log(err))
}

exports.getOrders = function (req, res, next) {
    req.user.getOrders({include:['products']})
        .then(orders => {
            console.log(orders)
            res.render('./shop/orders', { orders: orders, title: 'Orders', activeCheckout: 'orders' });

        })
        .catch(err => {
            console.log(err)
        });

}


// exports.checkout = function (req, res, next) {
//     const products = Product.fetchAll();
//     res.render('./shop/checkout', { products: products, title: 'Checkout', activeCheckout: 'active' });
// }