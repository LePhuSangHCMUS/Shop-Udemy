
//Database 
var sequelize = require('./util/database');
const Product = require('./models/products')
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cartItem');
const Order=require('./models/order')
const OrderItem=require('./models/orderItem')
//==================================================
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

//Taok middle ware kiem tra user co trong database chua neu chua co thi khong cho di tiep
app.use((req, res, next) => {
  User.findByPk(1)
    .then(user => {
      //Tim thay moi cho di qua khong thi thoi
      //Lay user guiwr den middleware tiep theo
      req.user = user;
      next();
    })
    .catch(err => console.log(err))
})



//Use router
app.use('/', indexRouter);
// app.use('/users', usersRouter);
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

//==========================SEQUELIZE=================================================================
//Association
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);
Cart.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasOne(Cart);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product,{through:OrderItem});

sequelize
  // .sync()
  .sync({ force: true })// drop cac bang va tao bang moi
  .then((result) => {
    //Them User dau tien
    return User.findByPk(2)
  })
  .then(user => {
    //Neu chua co user
    if (!user) {
      return User.create({ name: 'Mai', email: 'lephusangus@gmail.com' })
      .then(user=>{
        console.log('Create Cart User : ',user.id);
        user.createCart();
      })
      .catch(err=>console.log(err))
    }
    return Promise.resolve(user)
    //Or
    //Return user (sẽ ép thành promise)

  })
  .then(user => {
    //Neu co nguoi dung se tao ra cart
    // console.log(user)
  })
  .catch(err => console.log(err))



module.exports = app;
