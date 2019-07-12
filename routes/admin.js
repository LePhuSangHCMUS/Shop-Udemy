var express = require('express');
var router = express.Router();
//Controller product
const adminController=require('../controller/admin')

/* GET home page. */
router.get('/add-product',adminController.getAddProductController);
//Post Data
router.post('/add-product',adminController.postAddProductController);
//Show product in Admin
router.get('/products',adminController.getProductListController);
//Edit Get Product
router.get('/edit-product/:productId',adminController.getEditProductController);
/////Edit Get Product
router.post('/edit-product',adminController.postEditProductController);
//Delete Product
router.post('/delete-product/:productId',adminController.deleteProductController);

module.exports = router;
