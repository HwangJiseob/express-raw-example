const http = require('http')
const express = require('express')
const { createProxyMiddleware } = require('http-proxy-middleware');

const { settings } = require('../../settings')
const port = (()=>{ const { port } = settings.servers['api']; return Number(port)})()

const { Router, static } = express

const app = express()

app.get('/', (req, res) => {
  // console.log(req.headers)
  res.send("호호")
})

const server = http.createServer(app)
server.listen(port, ()=>{
  console.log(`Example app listening at http://localhost:${port}`)
})