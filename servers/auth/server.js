const http = require('http')
const express = require('express')
const mysql = require('mysql2/promise')
const { uid } = require('uid')
const bcrypt = require('bcrypt')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')

const { settings } = require('../../settings')
const passportConfig = require('./passport')
const { pool } = require('./db')

const port = (()=>{ const { port } = settings.servers['auth']; return Number(port)})()

const { Router, static } = express

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize())
passportConfig()

app.post('/', async (req, res) => {
  const [ result ] = await pool.query('SELECT * FROM auth.auth_key;')
  console.log(result)
  await res.send({"test": "auth test"})
})


app.post('/login', (req, res) => {
  // console.log(req.body)
  passport.authenticate('local', { session: false }, async (error, user) => {

    if(user){
      const token = await jwt.sign(user, process.env.JWT_SECRET_KEY, { expiresIn: "1h" })
      res.cookie('jwt',token, { httpOnly: true, maxAge: 3600 })
      // 위의 options에 secure: true를 설정하면 https에서만 사용 가능해진다.
      res.send("hoho")
    } else {
      res.send("not found")
    }

    // 위의 options에 secure: true를 설정하면 https에서만 사용 가능해진다.

  })(req, res)
})

app.post('/register', async (req, res) => {
  const { id, pw } = req.body
  const UID = uid(16)
  try{
    await bcrypt.hash(pw, 10, async (err, hash) => {
      const sqls = [
        ['INSERT INTO `auth_key` (`UID`, `id`, `pw`, `status`) VALUES (?, ?, ?, ?);', [UID, id, hash, 0]],
        [ 'INSERT INTO `user_info` (`UID`, `username`, `email`, `phone`) VALUES (?, ?, ?, ?);',
          [UID, 'test이름', 'test12@test.com', '010-1234-5678']
        ]
      ]
      let query = ``
      sqls.map(sql => {
        query += mysql.format(sql[0], sql[1])
      } );
      await pool.query(query)
    });
  } catch(e) {
    console.log("error: ", e)
  }
  res.send('registered')
})

app.post('/verify', async(req,  res) => {
  passport.authenticate('jwt', { session: false }, (error, user) => {
    if(user){
      res.send(true)
    } else {
      res.send(false)
    }

  })(req, res)
})

const server = http.createServer(app)
server.listen(port, ()=>{
  console.log(`Auth server listening at http://localhost:${port}`)
})