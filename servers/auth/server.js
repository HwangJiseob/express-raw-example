const http = require('http')
const express = require('express')
const mysql = require('mysql2/promise')
const { uid } = require('uid')
const bcrypt = require('bcrypt');

require("dotenv").config()

const { settings } = require('../../settings')

const port = (()=>{ const { port } = settings.servers['auth']; return Number(port)})()

const { Router, static } = express

const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
})

app.post('/login', async (req, res) => {
  const {id, pw} = req.body

  const result = await bcrypt.hash(pw, 5)
  console.log(result)
  console.log("bcrypt")
  


  res.send({"test": "auth test"})
})

const server = http.createServer(app)
server.listen(port, ()=>{
  console.log(`Auth server listening at http://localhost:${port}`)
})