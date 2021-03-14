const http = require('http')
const express = require('express')
const mysql = require('mysql2')
require("dotenv").config()

const { settings } = require('../../settings')
const port = (()=>{ const { port } = settings.servers['api']; return Number(port)})()

const { Router, static } = express

// execution

const dbconn = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : process.env.MYSQL_PW,
  database : "world"  //test
});
dbconn.connect()

dbconn.query('SELECT Name FROM world.city limit 10;', async (error, results, fields) => {
  if(error){
    throw error
  } else {
    console.log(results)
  }
});


const app = express()

app.get('/', (req, res) => {
  // console.log(req.headers)
  console.log("api get method on")
  res.send({"test": "test api result"})
})

const server = http.createServer(app)
server.listen(port, ()=>{
  console.log(`API server listening at http://localhost:${port}`)
})