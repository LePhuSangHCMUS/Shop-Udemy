//Model
const Product = require('../models/products');
const Cart = require('../models/cart');
//Do Add and Edit Same Nen Dung Chung 1 Form
exports.getAddProductController = function (req, res, next) {
    res.render('admin/add-edit-product', { title: 'Add Product', activeAddProduct: 'active', isEditMode: false });
}

exports.postAddProductController = function (req, res, next) {
    const product = new Product(req.body.title, req.body.urlImage, req.body.description, req.body.price);
    //=========User LowDB===================
    product.save();
    res.redirect('/shop');

    //=========User My SQL===================
    // product.save().then(result => {
    //     res.redirect('/shop');

    // })
    //     .catch(err => console.log(err));
}
//Edit Product Admin
//admin/add-product/:producId  ---> GET
exports.getEditProductController = function (req, res, next) {
    const productId = req.params.productId;
    const productEdit=Product.findOneProduct(productId);
     res.render('admin/add-edit-product', { productEdit: productEdit, title: 'Edit Product', activeAddProduct: '', isEditMode: true });

    // Product.findOneProduct(productId).
    //     then(([row, fieldData]) => {
    //         //Do tim thay mot product cung tra ve mang nen lay row[0];
    //         const productEdit = row[0];
    //         console.log(productEdit)
    //         res.render('admin/add-edit-product', { productEdit: productEdit, title: 'Edit Product', activeAddProduct: '', isEditMode: true });

    //     })
    //     .catch(err => console.log(err));
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
    Product.editProduct(productId, title, urlImage, description, price);
    res.redirect('/admin/products');
}

//Get List Prodcut Add Min
//admin/product
exports.getProductListController = function (req, res, next) {
    //=========User LowDB===================
    const products = Product.fetchAll();
    res.render('admin/product-list', { products: products, title: 'Admin Product', activeAdminProducts: 'active' });
    //=========User My SQL===================

    // Product.fetchAll()
    //     .then(([rows, fieldData]) => {
    //         console.log(rows);
    //         console.log(fieldData)
    //         const products = rows;
    //         console.log(rows)
    //         res.render('admin/product-list', { products: products, title: 'Admin Product', activeAdminProducts: 'active' });

    //     })
    //     .catch(err => console.log(err));
}
exports.deleteProductController = function (req, res, next) {
    //=========User LowDB===================

    Product.deleteProduct(req.params.productId);
    //Xps Admin thì xóa luon cart
    Cart.deleteProductFormCart(req.params.productId)
    res.redirect('/admin/products')
    //=========User My SQL===================
    // Product.deleteProduct(req.params.productId);
    // //Xoa Admin thì xóa luon cart
    // Cart.deleteProductFormCart(req.params.productId)
    //     .then(result => {
    //         res.redirect('/admin/products')

    //     })
    //     .catch(err => console.log(err))

}
