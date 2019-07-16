var express = require('express');
var router = express.Router();
var isAuth=require('../middleware/is-auth')
//Controller product
const adminController=require('../controller/admin')

/* GET home page. */
router.get('/add-product',isAuth,adminController.getAddProductController);
//Post Data
router.post('/add-product',adminController.postAddProductController);
//Show product in Admin
router.get('/products',adminController.getProductListController);
//Edit Get Product
router.get('/edit-product/:productId',isAuth,adminController.getEditProductController);
/////Edit Get Product
router.post('/edit-product',isAuth,adminController.postEditProductController);
//Delete Product
router.post('/delete-product/:productId',isAuth,adminController.deleteProductController);

module.exports = router;
