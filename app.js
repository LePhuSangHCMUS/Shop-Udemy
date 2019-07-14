
//Database 
const mongooseConnect = require('./util/database');
const ModelUser = require('./models/user');
const ObjectID = require('mongodb').ObjectID;
//==================================================
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');

//Require Router
var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
//------------
var adminRouter = require("./routes/admin")
var shopRouter = require("./routes/shop")

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
// app.set('views', path.join(__dirname, 'views','admin'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

//Connect Database
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
//=============================================
//Filter User

app.use((req, res, next) => {
  try {
    ModelUser.findById(new ObjectID('5d26e39c1c9d440000b1d798'))
      .then(user => {
        console.log(user);
        req.user = user;
        next();
      })
  } catch (err) {
    console.log(err);

  }



})



//Use router
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
