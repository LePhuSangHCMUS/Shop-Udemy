var express = require('express');
var router = express.Router();
//Controller product
const adminController=require('../controller/admin')
//DB
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json');
const db = low(adapter)

db.defaults({ products: [] })
    .write()




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
