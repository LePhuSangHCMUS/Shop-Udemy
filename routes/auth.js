var express = require('express');
var router = express.Router();
var isAuth = require('../middleware/is-auth')
const { check, validationResult,body } = require('express-validator');
//Controller Index
const authController = require('../controller/auth')

/* GET home page. */
router.get('/login', authController.getLogin);
router.post('/login', [
    // username must be an email
    check('email')
        .isEmail()
        .withMessage('Please enter a valid email'),
    // password must be at least 5 chars long
    body(
        'password',
        'Please enter a password with only number and text and least 5 characters'
    ).isLength({ min: 5 })
    .isAlphanumeric(), 
], authController.postLogin);
router.post('/logout', authController.postLogout);
router.get('/signup', authController.getSignup);
router.post('/signup', [
    // username must be an email
    check('email')
        .isEmail()
        .withMessage('Please enter a valid email')
        .custom((value, { req }) => {
            if (value === 'lephusangus@gmail.com') {
                throw new Error('This email address if forbidden ')
            }
            return true;
        }),
    // password must be at least 5 chars long
    body(
        'password',
        'Please enter a password with only number and text and least 5 characters'
    ).isLength({ min: 5 })
    .isAlphanumeric()
    //Khong check pass trung nhau nua vi dang co loi xay ra
    // body(
    //     'password',
    //     'Please enter the same password and password as the same'
    // ).equals('confirmPassword'),
    
], authController.postSignup);
router.post('/verify', authController.postVerify);
//Nhap mail verify
router.get('/enter-email-verify', authController.getEnterMailVerify);
router.post('/enter-email-verify', authController.postEnterMailVerify);
//Reset pssword
router.get('/email-reset-password', authController.getEmailResetPassword);
router.post('/email-reset-password', authController.postEmailResetPassword);
router.get('/new-password/:resetToken', authController.getNewPassword);
router.post('/new-password', authController.postNewPassword);


module.exports = router;
