var express = require('express');
var router = express.Router();
var isAuth=require('../middleware/is-auth')

//Controller Index
const authController = require('../controller/auth')

/* GET home page. */
router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);
router.post('/logout', authController.postLogout);
router.get('/signup', authController.getSignup);
router.post('/signup', authController.postSignup);

module.exports = router;
