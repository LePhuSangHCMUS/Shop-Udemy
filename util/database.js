// get the client
const mysql = require('mysql2');
 
// create the connection to database
const pool  = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'shop',
  password:'password'
});
 
module.exports=pool.promise();