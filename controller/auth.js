const User = require('../models/user');
//hash pass use bcrypt
const bcryptjs = require("bcryptjs")

exports.getLogin = (req, res, next) => {
  if(req.session.isLoggedIn){
    return res.redirect('/shop');
  }
  res.render('./auth/login', { title: 'LOGIN', activeLogin: 'active', isAuthenticated: false,csrfToken:req.csrfToken() });
  console.log(req.session)

}
exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  //Dau hieu la ban da dang nhap thanh cong
  console.log(email, password);
  // res.cookie('remember', '1', { expires: new Date(Date.now() + 900000), httpOnly: true });
  User.findOne({ email:email })
    .then(user => {
      console.log(user)
      if (user) {
        bcryptjs.compare(password,user.password)
          .then(result => {
            console.log(result);
            //neu dang nhap thanh cong tao ra session ID de duy tri dang nhap
            if (result) {
              req.session.isLoggedIn = true;
              req.session.user = user;
              req.session.save(result => {
                res.redirect('/shop');
              })
            }
            else{
              res.render('./auth/login', { title: 'LOGIN', activeSignIn: 'active', isAuthenticated: false,passwordWrong:true ,csrfToken:req.csrfToken() })
 
            }
          })


      }
      else{
        res.render('./auth/login', { title: 'LOGIN', activeSignup: 'active', isAuthenticated: false,userNotExist:true,csrfToken:req.csrfToken() })

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
  res.render('./auth/signup', { title: 'SIGNUP', activeSignup: 'active', isAuthenticated: false,csrfToken:req.csrfToken() })
}
exports.postSignup = (req, res, next) => {

  //Lay email pass va confim pass
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  //Kiem tra xem email da dang ki chua
  User.findOne({ $or: [{ email: email }, { username: username }] })
    .then(user => {
      if (user) {
        console.log(user);
        res.render('./auth/signup', { title: 'SIGNUP', activeSignup: 'active', isAuthenticated: false, emailIsExist: true,csrfToken:req.csrfToken() })
      }
      else {
        return bcryptjs.hash(password, 12)
          .then(hashedPassword => {
            user = new User({ email: email, username: username, password: hashedPassword });
            user.save()
              .then(result => {
                res.redirect('/login');
              })
              .catch(err => {
                console.log(err)
              })
          })

      }
    })
}