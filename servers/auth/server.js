const http = require('http')
const express = require('express')
const mysql = require('mysql2/promise')
const { uid } = require('uid')

require("dotenv").config()

const { settings } = require('../../settings')

const port = (()=>{ const { port } = settings.servers['auth']; return Number(port)})()

const { Router, static } = express

const app = express()

const pool = mysql.createPool({
  host     : 'localhost',
  user     : 'root',
  password : process.env.MYSQL_PW,
  database : "auth"
});

app.post('/', async (req, res) => {

  const [ result ] = await pool.query('SELECT * FROM auth.auth_key;')
  console.log(result)
  await res.send({"test": "auth test"})
  // res.send("auth test")
})

const server = http.createServer(app)
server.listen(port, ()=>{
  console.log(`Auth server listening at http://localhost:${port}`)
})