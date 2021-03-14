const http = require('http')
const express = require('express')

const { settings } = require('../../settings')

const port = (()=>{ const { port } = settings.servers['auth']; return Number(port)})()

const { Router, static } = express

const app = express()


app.get('/', (req, res) => {
  // console.log(req.headers)
  res.send("하하")
})

const server = http.createServer(app)
server.listen(port, ()=>{
  console.log(`Example app listening at http://localhost:${port}`)
})