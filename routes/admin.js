var express = require('express');
var router = express.Router();
var isAuth=require('../middleware/is-auth')
//Controller product
const adminController=require('../controller/admin')

/* GET home page. */
router.get('/add-product',isAuth,isAuth,adminController.getAddProductController);
//Post Data
//Add middleware upload file multer
router.post('/add-product',isAuth,adminController.postAddProductController);
//Show product in Admin
router.get('/products',isAuth,adminController.getProductListController);
//Edit Get Product
router.get('/edit-product/:productId',isAuth,adminController.getEditProductController);
/////Edit Get Product
router.post('/edit-product',isAuth,adminController.postEditProductController);
//Delete Product
// router.post('/delete-product/:productId',isAuth,adminController.deleteProductController);
//SU dung ly thuat async request de khong tar ve json khong load lai trang
 router.delete('/product/:productId',isAuth,adminController.deleteProductController);


module.exports = router;
