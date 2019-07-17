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
router.post('/verify',authController.postVerify);
//Nhap mail verify
router.get('/enter-email-verify',authController.getEnterMailVerify);
router.post('/enter-email-verify',authController.postEnterMailVerify);
//Reset pssword
router.get('/email-reset-password',authController.getEmailResetPassword);
router.post('/email-reset-password',authController.postEmailResetPassword);
router.get('/new-password/:resetToken',authController.getNewPassword);
router.post('/new-password',authController.postNewPassword);


module.exports = router;
