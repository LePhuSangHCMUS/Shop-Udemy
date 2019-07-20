var express = require('express');
var router = express.Router();
//Controller Index
const indexController=require('../controller/index')

/* GET home page. */
router.get('/',indexController.getProductList );
module.exports = router;
