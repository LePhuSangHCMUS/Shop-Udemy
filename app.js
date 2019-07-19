
const MONGODB_URI = 'mongodb+srv://PhuSang:Nu06081995@cluster0-qjak0.mongodb.net/Shop?retryWrites=true&w=majority';
///BIEN MOI TRUONG
require('dotenv').config()

//Database 
const mongooseConnect = require('./util/database');
const User = require('./models/user');
const ObjectID = require('mongodb').ObjectID;
//=====================================SESSION====================================
var session = require('express-session')
//=====================STORE SESSION MONGOGDB
var MongoDBStore = require('connect-mongodb-session')(session);

//==================================================

//==================================
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//Require Router
var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
//------------
var adminRouter = require("./routes/admin")
var shopRouter = require("./routes/shop")
var authRouter = require('./routes/auth')
//===========APP===================================
var app = express();
// Multer upload file
var multer = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    //Phai tao truoc forder uploads
    cb(null, './public/uploads')
  },
  filename: function (req, file, cb) {
    const originalname = file.originalname.split('.')
    cb(null, originalname[0] + '-' + Date.now() + `.${originalname[1]}`)
  }
})
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png' ||file.mimetype === 'image/jpg' ||file.mimetype === 'image/jpeg'||file.mimetype === 'image/gif' ){
    cb(null,true)
  }
  else{
    cb(null,false);
  }
}
  
var upload = multer({ storage: storage, fileFilter: fileFilter })

// var multer  = require('multer')
// var upload = multer({ dest: 'uploads/' })

//=======Chong Tan Cong CSRF(CSURF)
var csurf = require('csurf');
// setup route middlewares
var csrfProtection = csurf({ cookie: true })
// view engine setup
app.set('views', path.join(__dirname, 'views'));
// app.set('views', path.join(__dirname, 'views','admin'));
app.set('view engine', 'pug');
app.use(upload.single('productImage'));
//=======================================================
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//middle ware csurf
app.use(csrfProtection);
//middle ware mullter
//=======================================SESSION============================
// Connect Database
try {
  mongooseConnect()
    .then(result => {
      console.log("Connected success")
    })
    .catch(err => {
      console.log(err)
    });

} catch (err) {
  console.log(err)
}
//==============Init Store Session MongoDB=========================
//Trong database se xuat hien collection sessions
var store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});
// Initializing the Session Middleware
app.use(session({
  secret: 'my secret',
  resave: false,
  saveUninitialized: false,//luu gia tri cookie sau khi dong trinh duyet hay khong
  store: store//Noi luu tru session
})
)
//=============================================
//Filter User
//Co The Khong Can Vi Ta DUng Session het roi
app.use((req, res, next) => {
  try {
    if (!req.session.user) {
      return next();
    }
    User.findById(req.session.user._id)
      .then(user => {
        req.user = user;
        next();
      })
      .catch(err => console.log(err));

  } catch (err) {
    console.log(err);

  }

})



//Use router
app.use('/', authRouter);
app.use('/', indexRouter);
//--------------------
app.use('/admin', adminRouter);
app.use('/shop', shopRouter);





// catch 404 and forward to error handler
app.use(function (req, res, next) {
  // next(createError(404));
  res.render('error-404', { title: 'Page Not Found' });
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
