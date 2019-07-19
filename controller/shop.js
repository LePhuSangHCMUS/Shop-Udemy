
//Model Data
const Product = require('../models/products');
const Cart = require('../models/cart');
const User = require('../models/user');
const Order = require('../models/order');
const ObjectID = require('mongodb').ObjectID;
//Doc file de duir dowload qua header
const fs = require('fs');
const path = require('path')
//Tao file pdf order invoice
const PDFDocument = require('pdfkit');

//Get Products All
exports.getProductShop = function (req, res, next) {
    //Khong can lay san pham theo user vi phai lay het tat ca san pham
    // const user = req.session.user;
    const isLoggedIn = req.session.isLoggedIn;
    // console.log(isLoggedIn)
    // Product.find({ userId: user._id })
    //Cai tien lay het tat ca san pham
    Product.find()
        //Chọn ra nhung thuoc tinh ma minh nhan (- la loại bỏ _id) nhưng muon lay het
        // .select('title price imageUrl -_id')
        //Lay thong tin user luon dung populate
        // .populate('userId')
        // .populate('userId name email')
        .then(products => {
            res.render('./shop/product-shop', { products: products, title: 'SHOP', activeShop: 'active', isAuthenticated: isLoggedIn, csrfToken: req.csrfToken() });

        })

}
exports.getProductListDeTail = function (req, res, next) {
    const isLoggedIn = req.session.isLoggedIn;
    Product.find()
        .then(products => {
            res.render('./shop/product-shop', { products: products, title: 'SHOP', activeShop: 'active', isAuthenticated: isLoggedIn, csrfToken: req.csrfToken() });

        })

}
//Get Product Detail
exports.getProductDetail = function (req, res, next) {
    const productId = req.params.productId;
    const isLoggedIn = req.session.isLoggedIn;

    Product.findOne(new ObjectID(productId))
        .then(product => {
            res.render('./shop/product-detail', { product: product, title: product.title, activeProducts: 'active', isAuthenticated: isLoggedIn, csrfToken: req.csrfToken() });

        });
}

//-------------------------------CART------------------------------
//shop/cart--> POST
//Them product vao cart
exports.postCart = function (req, res, next) {
    const user = req.session.user;
    const userId = user._id;
    const productId = req.body.productId;
    // const cart = new Cart(userId, productId);
    // Get product  the documents collection
    //Neu Ton Tai product thi tang quantity len thoi
    Cart.findOne({ productId: new ObjectID(productId), userId: userId })
        .then(cart => {
            //Neu Tim san pham khong ton tai trong cart thi them moi
            if (!cart) {
                try {
                    const quantity = 1;
                    const newCartItem = new Cart({ userId, productId, quantity });
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
    const user = req.session.user;
    const userId = user._id;
    const isLoggedIn = req.session.isLoggedIn;

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
                    res.render('./shop/cart', { productsCart: prosCartMap, title: 'Cart', activeCart: 'active', isAuthenticated: isLoggedIn, csrfToken: req.csrfToken() });
                });

        })
    } catch (err) {
        console.log(err)
    }
}
//Delete product from cart
exports.deleteProductFromCart = function (req, res, next) {
    const user = req.session.user;
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
    const user = req.session.user;
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
                        //create new order
                        const order = new Order({ userId, productsCart: prosCartMap });
                        order.save()
                            .then(result => {
                                console.log("Insert 1 new Order");
                                //Sau Khi Order Thanh Cong Thì Clear Cart
                                Cart.deleteMany({ userId: userId }).then(result => {
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
    var user = req.session.user;
    const isLoggedIn = req.session.isLoggedIn;

    try {
        Order.find({ userId: user._id })
            .then(orders => {
                res.render('./shop/orders', { orders: orders, title: 'Orders', activeOrder: 'active', isAuthenticated: isLoggedIn, csrfToken: req.csrfToken() });
            })
    } catch (err) {
        console.log(err)
    }

}
exports.getInvoice = (req, res, next) => {
    const orderId = req.params.orderId;
    //orderid la chuoi 12 byte hoac 24 chacracter
    if (orderId.length != 24) {
        return res.redirect('/');
    }



    Order.findOne({ _id: new ObjectID(orderId) })
        .then(order => {
            if (order) {
                const invoiceName = 'invoice-' + orderId + '.pdf';
                console.log(invoiceName);
                console.log(path);
                const invoicePath = path.join('data', 'invoices', invoiceName).replace(/\\/g, '/');

                //=============================================
                //Dowload file co san dung fs.createReadStream

                // var file = fs.createReadStream(invoicePath);
                // var stat = fs.statSync(invoicePath);
                // res.setHeader('Content-Length', stat.size);
                // res.setHeader('Content-Type', 'application/pdf');
                // //Tu dong dowload luon
                // // res.setHeader('Content-Disposition', `attachment; filename=${invoiceName}`);
                // file.pipe(res);
                //=============================================

                //Use PDF KIT Create FIle PDF AND DOWLOAD
                // Create a document
                const pdfDoc = new PDFDocument;
                pdfDoc.pipe(fs.createWriteStream(invoicePath));
                pdfDoc.pipe(res);
                //Them font tieng viet 
                pdfDoc.font('./arial.ttf')
                pdfDoc.fontSize(18).text(`Invoice : #${order._id}`, {
                    underline: true
                });
                let priceTotal = 0;
                order.productsCart.forEach(product => {
                    pdfDoc.text(' ')
                    priceTotal += product.price * product.quantity;
                    pdfDoc.text(' ')
                    pdfDoc.text(`${product.title} :${product.quantity} x ${product.price} = ${product.price * product.quantity} $`);
                })
                pdfDoc.text('----------------------------------------------------');
                pdfDoc.text(' ')
                pdfDoc.text('Total = ' + priceTotal + '$');

                pdfDoc.end();

                //Download file
                var file = fs.createReadStream(invoicePath);
                file.addListener('finish', () => {
                    var stat = fs.statSync(invoicePath);
                    res.setHeader('Content-Length', stat.size);
                    res.setHeader('Content-Type', 'application/pdf');
                    // //Tu dong dowload luon
                    // // res.setHeader('Content-Disposition', `attachment; filename=${invoiceName}`);
                    file.pipe(res);


                })



            }
            else {

                res.redirect('/')
            }
        })
        .catch(err => {
            console.log(err)
            res.redirect('/')
        })



}


// exports.checkout = function (req, res, next) {
//     const products = Product.fetchAll();
//     res.render('./shop/checkout', { products: products, title: 'Checkout', activeCheckout: 'active' });
// }