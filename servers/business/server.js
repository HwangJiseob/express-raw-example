const http = require('http')
const express = require('express')
const { createProxyMiddleware } = require('http-proxy-middleware');



const { Router, static } = express

const app = express()
// const port = Number(process.env.PORT) || 3000
const port = 9000
console.log(process.env.PORT)

app.get('/', (req, res) => {
  // console.log(req.headers)
  res.send("하하")
})

const server = http.createServer(app)
server.listen(port, ()=>{
  console.log(`Example app listening at http://localhost:${port}`)
})