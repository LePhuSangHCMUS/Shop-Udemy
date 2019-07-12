//Model
const Product = require('../models/products');
const Cart = require('../models/cart');
//Do Add and Edit Same Nen Dung Chung 1 Form
exports.getAddProductController = function (req, res, next) {
    res.render('admin/add-edit-product', { title: 'Add Product', activeAddProduct: 'active', isEditMode: false });
}

exports.postAddProductController = function (req, res, next) {
    const userId = req.user._id;
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const price = req.body.price;
    //create product
    const product = new Product(userId, title, imageUrl, description, price);
    product.save().
        then(result => {
            res.redirect('/admin/products');

        })
        .catch(err => console.log(err));

}
//Edit Product Admin
//admin/add-product/:producId  ---> GET
exports.getEditProductController = function (req, res, next) {
    const productId = req.params.productId;
    //Lay tu middle ware khi dang nhap la ai
    Product.findOneProduct(productId)
        .then(productEdit => {
            res.render('admin/add-edit-product', { productEdit: productEdit, title: 'Edit Product', activeAddProduct: '', isEditMode: true });

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
    //Khong can suwr dung user lam gi ca
    Product.upDateOne(productId, title, imageUrl, description, price)
        .then(result => {
            res.redirect('/admin/products');

        })
        .catch(err => console.log(err));
}
//admin/product
exports.getProductListController = function (req, res, next) {
    const user = req.user;
    Product.fetchAllProductUser(user._id)
        .then(products => {
            console.log(products)
            res.render('admin/product-list', { products: products, title: 'Admin Product', activeAdminProducts: 'active' });

        })
}
exports.deleteProductController = function (req, res, next) {
    const user = req.user;
    const productId = req.params.productId;
    //Xoa product 
    Product.deleteOneProduct(productId)
        .then(result => {
            //Xoa Luon Trong Cart
            Cart.deleteProductFromCartUserIdAndProductId(user._id, productId).then(reuslt=>{
                res.redirect('/admin/products')
            })
        });
}
