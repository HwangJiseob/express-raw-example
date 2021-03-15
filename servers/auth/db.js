const mysql = require('mysql2/promise')
require("dotenv").config()

const pool = mysql.createPool({
  host     : 'localhost',
  user     : 'root',
  password : process.env.MYSQL_PW,
  database : "auth",
  multipleStatements: true  // 복수의 query문을 보낼 때 반드시 필요합니다.
});

module.exports = {
  pool: pool
}
