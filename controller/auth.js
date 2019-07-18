const User = require('../models/user');
//hash pass use bcrypt
const bcryptjs = require("bcryptjs");
//hash token reset pasword
var srs = require('secure-random-string');
//Send mailer signup success
const sgMail = require('@sendgrid/mail');
//Validation 
const { check, validationResult } = require('express-validator');

exports.getLogin = (req, res, next) => {
  if (req.session.isLoggedIn) {
    return res.redirect('/shop');
  }
  res.render('./auth/login', {
    title: 'LOGIN',
    activeLogin: 'active',
    isAuthenticated: false,
    csrfToken: req.csrfToken(),
    errMessage: []
  });
}
exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);

  //Dau hieu la ban da dang nhap thanh cong
  // res.cookie('remember', '1', { expires: new Date(Date.now() + 900000), httpOnly: true });
  User.findOne({ email: email })
    .then(user => {
      console.log(user)
      if (user) {
        bcryptjs.compare(password, user.password)
          .then(result => {
            console.log(result);
            //neu dang nhap thanh cong tao ra session ID de duy tri dang nhap
            if (result) {
              //Neu verify thi cho dang nhap khong thi thoi
              if (user.isVerify) {
                req.session.isLoggedIn = true;
                req.session.user = user;
                req.session.save(result => {
                  res.redirect('/shop');
                })
              }
              else {
                res.render('./auth/login', { title: 'LOGIN', activeSignIn: 'active', csrfToken: req.csrfToken(), verify: true ,errMessage:errors.array()})
              }
            }
            else {
              res.render('./auth/login', { title: 'LOGIN', activeSignIn: 'active', isAuthenticated: false, passwordWrong: true,errMessage:errors.array(), csrfToken: req.csrfToken() })

            }
          })


      }
      else {
        res.render('./auth/login', { title: 'LOGIN', activeSignup: 'active', isAuthenticated: false, userNotExist: true, csrfToken: req.csrfToken(),errMessage:errors.array() })

      }

    })
}


exports.postLogout = (req, res, next) => {

  req.session.destroy((err => {
    console.log(err);
    res.redirect('/')

  }))

}
//======================SIGNUP=================
exports.getSignup = (req, res, next) => {
  res.render('./auth/signup',
    {
      title: 'SIGNUP',
      activeSignup: 'active',
      isAuthenticated: false,
      csrfToken: req.csrfToken(),
      errMessage: []
    })
}
exports.postSignup = (req, res, next) => {
  //Lay email pass va confim pass
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  //Validation email password
  const errors = validationResult(req);
  console.log('err: ', errors.array())
  if (!errors.isEmpty()) {
    return res.status(422)
      .render('./auth/signup',
        {
          title: 'SIGNUP',
          activeSignup: 'active',
          isAuthenticated: false,
          errMessage: errors.array(),
          csrfToken: req.csrfToken(),
          email: email,
          username: username
        });
  }





  //Kiem tra xem email da dang ki chua
  User.findOne({ $or: [{ email: email }, { username: username }] })
    .then(user => {
      if (user) {
        res.render('./auth/signup',
          {
            title: 'SIGNUP',
            activeSignup: 'active',
            isAuthenticated: false,
            emailIsExist: true,
            csrfToken: req.csrfToken(),
            errMessage: errors.array(),
            email: email,
            username: username
          })
      }
      else {
        return bcryptjs.hash(password, 12)
          .then(hashedPassword => {
            const codeVerify = bcryptjs.hashSync('lephusang', 12);
            const codeVerifyExpiretion = Date.now() + 3600000//minh ban mili giay = 1h
            user = new User({
              email: email,
              username: username,
              password: hashedPassword,
              isVerify: false,
              codeVerify: codeVerify,
              codeVerifyExpiretion: codeVerifyExpiretion
            });
            user.save()
              .then(result => {
                //Luu thanh cong tai khoan
                sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                const msg = {
                  to: email,
                  from: 'sanuinc@gmail.com',
                  subject: 'signup succeeded',
                  text: 'Code : ',
                  html: '<h1>You successfully sign up</h1><h4>Code: </h4><code>' + codeVerify + '</code>',
                };
                sgMail.send(msg)
                  .then(result => {
                    res.render('./auth/verify', { title: 'SIGNUP', activeSignup: 'active', userId: user._id, csrfToken: req.csrfToken() });

                  }
                  );
              })
              .catch(err => {
                console.log(err)
              })
          })

      }
    })
}

exports.postVerify = (req, res, next) => {
  const userId = req.body.userId;
  const code = req.body.code;
  User.findOne({ _id: userId })
    .then(user => {
      if (user.codeVerify === code && user.codeVerifyExpiretion >= Date.now()) {
        User.updateOne({ _id: userId }, { isVerify: true })
          .then(result => {
            res.redirect('/login');
          })
      }
      else {
        res.render('./auth/verify', { title: 'SIGNUP', activeSignup: 'active', userId: userId, codeWrong: true, csrfToken: req.csrfToken() });

      }
    })
}
exports.getEnterMailVerify = (req, res, next) => {
  res.render('./auth/enter-email-verify', { title: 'SIGNIn', activeSignIn: 'active', csrfToken: req.csrfToken() });
}
exports.postEnterMailVerify = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then(user => {
      ///Sinh ra code moi gui vao mail va set code lai o database 
      if (user) {
        if (user.isVerify) {
          return res.render('./auth/enter-email-verify', { title: 'SIGNIn', isVerify: true, activeSignIn: 'active', csrfToken: req.csrfToken() });
        }
        const codeVerify = bcryptjs.hashSync('lephusang', 12);
        const codeVerifyExpiretion = Date.now() + 3600000//minh ban mili giay = 1h

        User.updateOne({ _id: user._id }, { codeVerify: codeVerify, codeVerifyExpiretion: codeVerifyExpiretion })
          .then(result => {
            //Luu thanh cong tai khoan
            sgMail.setApiKey(process.env.SENDGRID_API_KEY);
            const msg = {
              to: req.body.email,
              from: 'lephusangus@gmail.com',
              subject: 'signup succeeded',
              text: 'Code : ',
              html: '<h1>You successfully sign up</h1><h4>Code: </h4><code>' + codeVerify + '</code>',
            };
            sgMail.send(msg);
            res.render('./auth/verify', { title: 'SIGNUP', activeSignup: 'active', userId: user._id, csrfToken: req.csrfToken() });

          })
          .catch(err => {
            console.log(err)
          })
      }
      else {
        res.render('./auth/enter-email-verify', { title: 'SIGNIn', activeSignIn: 'active', emailIsnotExist: true, csrfToken: req.csrfToken() });
      }
    })
}
exports.getEmailResetPassword = (req, res, next) => {
  if (req.session.isLoggedIn) {
    return res.redirect('/');
  }
  res.render('./auth/email-reset', { title: 'ResetPassword', activeLogin: 'active', csrfToken: req.csrfToken() })
}
exports.postEmailResetPassword = (req, res, next) => {
  const email = req.body.email;
  const resetToken = srs({ length: 256 });
  User.findOne({ email: email })
    .then(user => {
      if (user) {
        user.resetToken = resetToken;
        user.resetTokenExpiration = Date.now() + 3600000//co hieu luc 1 h ;
        user.save()
          .then(result => {
            //Gui mail thiet lap laij mat khau
            sgMail.setApiKey(process.env.SENDGRID_API_KEY);
            const msg = {
              to: email,
              from: 'sanuinc@gmail.com',
              subject: 'Password Reset',
              text: 'Code : ',
              html: `<p>You request a password reset</p
              <p> <a href="http://localhost:3000/new-password/${resetToken}">Click this<a</p>
              `,
            };
            sgMail.send(msg)
              .then(result => {
                res.render('./auth/check-mail', { resetPassword: true });
              }
              );
          });
      }
      else {
        res.render('./auth/email-reset', { title: 'ResetPassword', activeLogin: 'active', emailIsNotExist: true, csrfToken: req.csrfToken() })
      }
    })
}

exports.getNewPassword = (req, res, next) => {
  const resetToken = req.params.resetToken;
  User.findOne({ resetToken: resetToken, resetTokenExpiration: { $gt: Date.now() } })
    .then(user => {
      if (user) {
        res.render('./auth/new-password', { title: 'ResetPassword', activeLogin: 'active', userId: user._id, resetToken: resetToken, csrfToken: req.csrfToken() })
      }
      else {
        res.render('./auth/check-mail', { resetTokenExpiration: true })

      }
    })

}

exports.postNewPassword = (req, res, next) => {
  const resetToken = req.body.resetToken;
  const userId = req.body.userId;
  const resetPassword = req.body.resetPassword;
  const resetNewPassword = req.body.resetNewPassword;
  const newPass = bcryptjs.hashSync(resetPassword, 12);
  console.log('HAHAH:', userId, resetToken)
  User.findOne({ resetToken: resetToken, _id: userId })
    .then(user => {
      if (user) {
        console.log(user);
        user.password = newPass;
        user.save()
          .then(result => {
            res.redirect('/login');
          })
      }
      else {
        res.redirect('/')

      }
    })

}