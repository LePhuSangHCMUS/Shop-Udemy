//Model
const Product = require('../models/products');
const Cart = require('../models/cart');
//Do Add and Edit Same Nen Dung Chung 1 Form
exports.getAddProductController = function (req, res, next) {
    const isLoggedIn=req.session.isLoggedIn;
    res.render('admin/add-edit-product', { title: 'Add Product', activeAddProduct: 'active', isEditMode: false,isAuthenticated:isLoggedIn,csrfToken:req.csrfToken() });
}

exports.postAddProductController = function (req, res, next) {
    const userId = req.user._id;
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const price = req.body.price;
    //create product
    const product = new Product({ userId, title, imageUrl, description, price });
    product.save().
        then(result => {
            console.log(result);
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));

}
//Edit Product Admin
//admin/add-product/:producId  ---> GET
exports.getEditProductController = function (req, res, next) {
    const productId = req.params.productId;
    //Neu Da Dang nhap
    const isLoggedIn=req.session.isLoggedIn;

    //Lay tu middle ware khi dang nhap la ai
    Product.findOne({ _id: productId })
        .then(productEdit => {
            res.render('admin/add-edit-product', { productEdit: productEdit, title: 'Edit Product', activeAddProduct: '', isEditMode: true,isAuthenticated:isLoggedIn,csrfToken:req.csrfToken() });

        })
        .catch(err => {
            console.log(err)
        })

}
////admin/add-product/:producId  ---> POST
exports.postEditProductController = function (req, res, next) {
    const productId = req.body.productId;
    //Khong thay the id
    const title = req.body.title
    const description = req.body.description
    const price = req.body.price;
    const imageUrl = req.body.imageUrl;
    //edit product
    //Bowi vi khi vao trang quan tri thi se hien thi chi nhung san pham cua nguoi dung do 
    //nen xoa sua san pham co id trung voi no la duoc
    //Khong can sua dung user lam gi ca
    Product.updateOne({ _id: productId }, { title: title, imageUrl: imageUrl, description: description, price: price })
        .then(result => {
            res.redirect('/admin/products');

        })
        .catch(err => console.log(err));
}
//admin/product
exports.getProductListController = function (req, res, next) {
    const user = req.session.user;
    const userId = user._id;
    const isLoggedIn=req.session.isLoggedIn;

    console.log(user)
    Product.find({ userId: user._id })
        .then(products => {
            console.log(products)
            res.render('admin/product-list', { products: products, title: 'Admin Product', activeAdminProducts: 'active',isAuthenticated:isLoggedIn,csrfToken:req.csrfToken() });

        })
}
exports.deleteProductController = function (req, res, next) {
    const user = req.user;
    const productId = req.params.productId;
    //Xoa product 
    Product.deleteOne({ _id: productId })
        .then(result => {
            //Xoa Luon Trong Cart
            try {
                Cart.deleteOne({ userId: user._id, productId: new ObjectID(productCartId) }).then(result => {
                    console.log("Delete Success");
                    res.redirect('/shop/cart');

                })
            } catch (err) {
                console.log(err);
                console.log("Not delete");
            }
            res.redirect('/admin/products')
        })
}
