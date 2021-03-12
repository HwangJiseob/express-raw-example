const http = require('http')
const express = require('express')
const { createProxyMiddleware } = require('http-proxy-middleware');

const { settings } = require('../../settings')
const port = (()=>{ const { port } = settings.servers['api']; return Number(port)})()

const { Router, static } = express

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