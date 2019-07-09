var express = require('express');
var router = express.Router();


//Controller Shop
 const shopController=require('../controller/shop')

/* GET home page. */
router.get('/',shopController.getProductShop );
//Get products all
router.get('/products',shopController.getProductListDeTail );

//Get product detal
router.get('/product-detail/:productId',shopController.getProductDetail );
//Dùng cách khác nên không sài cách này
//router.post('/cart/:productId',shopController.addToCart );
//Them san pham vao cart
router.post('/cart',shopController.postCart );
//Request  ve giao dien cart
router.get('/cart',shopController.getCart );
//delete cart
router.post('/cart/delete',shopController.deleteProductFromCart);

router.get('/orders',shopController.orders );
router.get('/checkout',shopController.checkout );


module.exports = router;
