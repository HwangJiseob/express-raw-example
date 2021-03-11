const http = require('http')
const express = require('express')
const { createProxyMiddleware } = require('http-proxy-middleware');

const { Router, static } = express

const app = express()
const port = Number(process.env.PORT) || 3000

app.set('views', __dirname + '/src/pages')
app.set('view engine', 'jsx')
app.engine('jsx', require('express-react-views').createEngine());

app.use(
  createProxyMiddleware('/api', {
      target: 'http://localhost:3000/public',
      changeOrigin: true
  })
)


app.get('/', (req, res) => {
  // console.log(req.headers)
  res.render('index', {message: "Hello World!!", req: req, res: res})
})

app.use('/public', static(__dirname + '/public'))




// express의 app.listen() 대신 http의 server.listen()을 쓰는 이유는
// socket.io와의 연동 때문입니다. socket io 객체는 http.Server 인스턴스를
// 인자로 받아 생성되기 때문입니다.
// 꼭 socket.io를 쓰지 않더라도 express 4에서는 이런 방식을 사용합니다.
// 출처: https://stackoverflow.com/questions/17696801/express-js-app-listen-vs-server-listen#answer-17697134

const server = http.createServer(app)
server.listen(port, ()=>{
  console.log(`Example app listening at http://localhost:${port}`)
})