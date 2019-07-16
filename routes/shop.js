var express = require('express');
var router = express.Router();
var isAuth=require('../middleware/is-auth')

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
router.post('/cart/delete',isAuth,shopController.deleteProductFromCart);
router.post('/cart',isAuth,shopController.postCart );
//Request  ve giao dien cart
//Truoc khi xem cart can phai dang nhap
router.get('/cart',isAuth,shopController.getCart );
//delete cart
router.post('/orders',isAuth,shopController.postOrders );
//truoc khi order phai dang nhap
router.get('/orders',isAuth,shopController.getOrders );
// router.get('/checkout',shopController.checkout );
// router.get('/checkout',shopController.orders );



module.exports = router;
