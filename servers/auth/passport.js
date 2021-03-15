const passport = require("passport")
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const { ExtractJwt } = passportJWT;
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require('bcrypt')

const { pool } = require('./db')

const passportConfig = {
  usernameField: "id",
  passwordField: "pw",
  session: false
}

// passport.serializeUser(function(user, done) {
//   console.log('serialize')
//   done(null, user);
// });

// passport.deserializeUser(function(user, done) {
//   console.log('deserialize')
//   done(null, user);
// });

async function localVerify(id, pw, done) {
  try {
    const [ row ] = (await pool.query('SELECT UID, pw FROM auth_key WHERE UID = (SELECT UID FROM auth.auth_key WHERE id =? );', [ id ]))[0]
    const comPW = row.pw

    const isAuth = await bcrypt.compare(pw, comPW)
    if(isAuth){
      const [ user ] = (await pool.query('SELECT * FROM user_info WHERE UID = ?;', [ row.UID ]))[0]
      return done(null, {...user});
    } else {
      return done(null, false)
    }
  } catch (e) {
    done(e);
  }
}

const cookieExtractor = (req) => {
  let token = null
  if(req && req.cookies){
    token = req.cookies['jwt']
  }
  return token
}

const jwtStrategyOption = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: process.env.JWT_SECRET_KEY,
};

async function jwtVerify(payload, done) {
  
  
  return done(null, payload);
} 

module.exports = () => {
  // passport.use('local', new LocalStrategy(passportVerify));
  passport.use('local', new LocalStrategy(passportConfig, localVerify));
  passport.use(new JWTStrategy(jwtStrategyOption, jwtVerify))
};