//Model
const Sequelize = require('sequelize');
const Product = require('../models/products');
//Sequelize exposes symbol operators that can be used for to create more complex comparisons -
const Op = Sequelize.Op;

const Cart = require('../models/cart');
const CartItem = require('../models/cartItem');
//Do Add and Edit Same Nen Dung Chung 1 Form
exports.getAddProductController = function (req, res, next) {
    res.render('admin/add-edit-product', { title: 'Add Product', activeAddProduct: 'active', isEditMode: false });
}

exports.postAddProductController = function (req, res, next) {
    const title = req.body.title;
    const urlImage = req.body.urlImage;
    const description = req.body.description;
    const price = req.body.price;
    const user = req.user;
    // Product.create({
    //     title: title,
    //     urlImage: urlImage,
    //     description: description,
    //     price: price,
    //     userId:userId
    // })
    //     .then(result => {
    //         console.log('Create product');
    //         res.redirect('/')
    //     })
    //     .catch(err => console.log(err));

    //====================Otherwise use Associating objects
    user.createProduct({
        title: title,
        urlImage: urlImage,
        description: description,
        price: price,
    })
        .then(result => {
            console.log('Create product');
            res.redirect('/')
        })
        .catch(err => console.log(err));

}
//Edit Product Admin
//admin/add-product/:producId  ---> GET
exports.getEditProductController = function (req, res, next) {
    const productId = req.params.productId;
    //Lay tu middle ware khi dang nhap la ai
    const user = req.user;
    user.getProducts({
        where: {
            id: productId
        }
    })
        .then(productEdit => {
            // console.log(productEdit)
            //Do ti tat ca nen no ra ca mang gia tri
            res.render('admin/add-edit-product', { productEdit: productEdit[0], title: 'Edit Product', activeAddProduct: '', isEditMode: true });

        })
        .catch(err => console.log(err));

}
////admin/add-product/:producId  ---> POST
exports.postEditProductController = function (req, res, next) {
    const productId = req.body.productId;
    //Khong thay the id
    const title = req.body.title
    const description = req.body.description
    const price = req.body.price;
    const urlImage = req.body.urlImage;
    //edit product
        //Bowi vi khi vao trang quan tri thi se hien thi chi nhung san pham cua nguoi dung do 
        //nen xoa sua san pham co id trung voi no la duoc
    //Khong can suwr dung user lam gi ca
    Product.update({
        title: title,
        description: description,
        price: price,
        urlImage: urlImage
    }, {
            where: {
                id: productId

            }
        })
        .then(result => {
            res.redirect('/admin/products');

        })
        .catch(err => console.log(err));
}

//Get List Prodcut Add Min
//admin/product
exports.getProductListController = function (req, res, next) {
    const user = req.user;
    user.getProducts()
        .then(products => {
            res.render('admin/product-list', { products: products, title: 'Admin Product', activeAdminProducts: 'active' });
        })
        .catch(err => console.log(err));
}
exports.deleteProductController = function (req, res, next) {
    const productId = req.params.productId;
        //Bowi vi khi vao trang quan tri thi se hien thi chi nhung san pham cua nguoi dung do
        // nen xoa san pham co id trung voi no la duoc
    //Khong can suwr dung user lam gi ca
    Product.findOne({
        where: {
            id: productId
        }
    })
        .then(product => {
            return product.destroy();
        })
        .then(result => {
            console.log('Delete Product Success');
            res.redirect('/admin/products')

        })
        .catch(err => console.log(err));

}
