
//Model Data
const Product = require('../models/products');
const Cart = require('../models/cart');
const User = require('../models/user');
const Order = require('../models/order');
const ObjectID = require('mongodb').ObjectID;
//Get Products All
exports.getProductShop = function (req, res, next) {
    const user = req.user;
    console.log(user)
    Product.find({ userId: user._id })
    //Chọn ra nhung thuoc tinh ma minh nhan (- la loại bỏ _id) nhưng muon lay het
        // .select('title price imageUrl -_id')
        //Lay thong tin user luon dung populate
        // .populate('userId')
        // .populate('userId name email')
        .then(products => {
            console.log(products)
            res.render('./shop/product-shop', { products: products, title: 'SHOP', activeShop: 'active' });

        })

}
exports.getProductListDeTail = function (req, res, next) {
    const user = req.user;
    console.log(user)
    Product.find({ userId: user._id })
        .then(products => {
            console.log(products)
            res.render('./shop/product-shop', { products: products, title: 'SHOP', activeShop: 'active' });

        })

}
//Get Product Detail
exports.getProductDetail = function (req, res, next) {
    const productId = req.params.productId;

    Product.findOne(new ObjectID(productId))
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
    // const cart = new Cart(userId, productId);
    // Get product  the documents collection
    //Neu Ton Tai product thi tang quantity len thoi
    Cart.findOne({ productId: new ObjectID(productId), userId: userId })
        .then(cart => {
            //Neu Tim san pham khong ton tai trong cart thi them moi
            console.log(cart)
            if (!cart) {
                try {
                    const quantity = 1;
                    const newCartItem = new Cart({ userId, productId, quantity });
                    console.log(newCartItem);
                    //Them moi san pham
                    newCartItem.save()
                        .then(result => {
                            console.log("Insert  New Cart");
                            res.redirect('/shop/cart')
                        })
                        .catch(err => {
                            console.log(err)
                        });
                } catch (err) {
                    console.log(err);
                    console.log('Insert New Cart Wrong');
                }
            }
            ///Neu tim thay thi tang quantity len
            else {
                const newQuantity = cart.quantity + 1;
                Cart.updateOne(
                    { productId: new ObjectID(productId), userId: userId }
                    , {
                        $set: { quantity: newQuantity }
                    })
                    .then(result => {
                        console.log("Update Quantity");
                        res.redirect('/shop/cart')
                    })
            }
        })
}





//Giao dien cart
////shop/cart--> GET (navigation)
exports.getCart = function (req, res, next) {
    const userId = req.user._id;
    try {
        Cart.find({ userId: userId }).then(carts => {
            // console.log(carts);
            // Mang idProduct in cart
            const productIds = carts.map(cart => {
                return cart.productId;
            })

            ///Tim nhieu product trong cart
            Product.find(
                {
                    _id: {
                        $in: productIds
                    }
                })
                .then(productsCart => {
                    // console.log(productsCart)
                    const prosCartMap = productsCart.map(product => {
                        ///find la method cu mang
                        return {
                            title: product.title,
                            description: product.description,
                            price: product.price,
                            imageUrl: product.imageUrl,
                            productId: product._id,
                            //Tim quantity ung vowi productId trong card
                            quantity: carts.find(cart => {
                                //Do la doi tuong ne khong so sanh === duco nen chuyen ve string
                                return cart.productId.toString() === product._id.toString();
                            }).quantity
                        }


                    })
                    console.log(prosCartMap)
                    res.render('./shop/cart', { productsCart: prosCartMap, title: 'Cart', activeCart: 'active' });
                });

        })
    } catch (err) {
        console.log(err)
    }
}
//Delete product from cart
exports.deleteProductFromCart = function (req, res, next) {
    const user = req.user;
    const productCartId = req.body.productCartId;
    try {
        Cart.deleteOne({ userId: user._id, productId: new ObjectID(productCartId) }).then(result => {
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
    const user = req.user;
    const userId = user._id;
    try {
        return Cart.find({ userId: userId })
            .then(carts => {
                const productIds = carts.map(cart => {
                    return cart.productId;
                })
                ///Tim nhieu product trong cart
                Product.find(
                    {
                        _id: {
                            $in: productIds
                        }
                    })
                    .then(productsCart => {
                        // console.log(productsCart)
                        const prosCartMap = productsCart.map(product => {
                            ///find la method cu mang
                            return {
                                productId: product._id,
                                title: product.title,
                                imageUrl: product.imageUrl,
                                description: product.description,
                                price: product.price,
                                //Tim quantity ung vowi productId trong card
                                quantity: carts.find(cart => {
                                    //Do la doi tuong ne khong so sanh === duco nen chuyen ve string
                                    return cart.productId.toString() === product._id.toString();
                                }).quantity
                            }


                        })
                        console.log(prosCartMap);
                        //create new order
                        const order = new Order({ userId, productsCart: prosCartMap });
                        order.save()
                            .then(result => {
                                console.log("Insert 1 new Order");
                                //Sau Khi Order Thanh Cong Thì Clear Cart
                                Cart.deleteMany({userId:userId}).then(result=>{
                                    console.log("Clear Cart success");
                                    res.redirect('/shop/cart');
                                })

                            });
                    });

            })
    } catch (err) {
        console.log(err);
    }

}

exports.getOrders = function (req, res, next) {
    var user = req.user;

    try {
        Order.find({ userId: user._id })
            .then(orders => {
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