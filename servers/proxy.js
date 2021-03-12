const http = require('http')
const express = require('express')
const { createProxyMiddleware } = require('http-proxy-middleware');

const { proxy, auth, front, api } = require('../settings').settings.servers

const port = (()=>{ const { port } = proxy; return Number(port)})()

const { Router, static } = express

const app = express()

const api_proxy = createProxyMiddleware({
  target: `http://localhost:${api.port}/`,
  changeOrigin: true,
  pathRewrite: {'^/api' : ''},
  onError: (err, req, res) => {
    res.writeHead(500, {
      'Content-Type': 'text/plain',
    });
    console.log(err)
    res.end('Something went wrong. And we are reporting a custom error message.');
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log('api')
  },
  onProxyRes: (proxyRes, req, res) => {
  }
})

const front_proxy = createProxyMiddleware({
  target: `http://localhost:${front.port}`,
  changeOrigin: true,   // cors 이슈 방지
  onError: (err, req, res) => {
    res.writeHead(500, {
      'Content-Type': 'text/plain',
    });
    res.end('Something went wrong. And we are reporting a custom error message.');
  },
  onProxyReq: (proxyReq, req, res) => {
  },
  onProxyRes: (proxyRes, req, res) => {
  }
})

app.use('/api', api_proxy)
app.use('/', front_proxy)


// app.get('/', (req, res) => {
//   // console.log(req.headers)
//   res.render('index', {message: "Hello World!!", req: req, res: res})
// })

// app.get('/login', (req,res) => {
//   res.render('login')
// })

app.use('/public', static(__dirname + '/public'))


const server = http.createServer(app)
server.listen(port, ()=>{
  console.log(`Proxy server at http://localhost:${port}`)
})