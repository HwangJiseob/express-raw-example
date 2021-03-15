---
title: passport 사용하기
date: 2020-02-23
tags: ["backend", "백엔드", "express", "passport", "passport-local"]
series: express로 백엔드 공부하기
thumbnail: "..."
description: passport
---

예전에 passport를 익힐 때도 뭐가 뭔지 몰라서 한참을 해맸는데, 이번에 passport를 연동할 때도 해맸습니다. 처음에 passport를 먼저 연동하고 그 다음에 jwt를 연동하면 될 줄 알았는데, passport-jwt로 한 번에 끝내야 했습니다. 그러지 않아서 더 해맸네요.

# passport
paasport로 jwt를 구현하려면 꽤 많은 모듈들이 필요합니다. 인증 전반을 담당할 `passport`와 로그인을 처리하기 위한 `passport-local`, 비밀번호를 암호화하기 위한 `bcrypt`, 토큰을 생성하기 위한 `jsonwebtoken`, 그리고 토큰을 검증하기 위한 `passport-jwt`가 필요합니다.

사실 여기까지는 발급 및 검증을 위한 최소한의 모듈들이고, 이후에 jwt 갱신 로직도 구현해야하며 실제 서비스에서는 custom jwt보다는 (만약 jwt 방식으로 한다면) OAuth 2.0으로 인증을 구현해야 합니다.

이 프로젝트는 인증 로직이 아니라 인증 서버를 구현하는 것이 목적이므로 custom jwt만 구현했습니다.

##  passport로 로그인(및 jwt 발급)
인터넷에 passport 관련 포스팅들을 읽어보면 알겠지만, 실제 코드 작성 순서와 코드 동작 순서가 달라서 개념이 안 와닿을 수 있습니다. 거기에 strategy라는 단어 때문에 더 감이 안 올 수가 있습니다. 실제 서버에서 동작하는 passport 코드는 다음과 같습니다.

```js:title=./app.js
...
const passport = require('passport')
const useStrategies = require('./passport')

app.use(passport.initialize())
useStrategies()

app.post('/login', passport.authenticate('local', 
  { successRedirect: '/', failureRedirect: '/login' }
))
```

5번 라인의 `useStategies`는 `./passport`에서 정의한 전략들을 passport 객체에 추가하는 코드입니다. 그리고 7-9번 라인은 `local-Strategy`로 사용자를 인증하는 코드입니다. 7-9번 라인을 부연설명하자면, 이와 관련하여 [Passport 공식 문서](http://www.passportjs.org/docs)에 미들웨어에서 passport를 사용하는 방법이 나옵니다. 정확하게 말하면 passport를 미들웨어로 사용하는 방법과 custom callback으로 사용하는 방법이 제시되어 있습니다. 예제에서는 간단하게 쓰기 위해서 아주 간단한 middleware 방식을 썼지만, 저는 token을 response cookie에 넣어서 반환하도록 설계했기 때문에 실제 코드에서 custom callback 방법을 사용하였습니다.

그리고 `passport.authenticate` 함수의 첫 번째 인자(strategy 인자)에 따라 전략이 달라지기 때문에 req에서 어떻게 인증 관련 정보를 추출하느냐도 달라집니다. `local`의 경우 req.body에서 key값이 `username`과 `password`인 data만 참조합니다. 참조하는 key값은 strategy에서 변경할 수 있습니다. 그리고 저는 jwt를 사용하지 않으므로 session은 만들지 않습니다.

```js:title=./passport.js
// module import 생략

const config = {
  usernameField: "id",
  passwordField: "pw",
  session: false
}

async function localVerify(id, pw, done) {
  try{
    const comPW = await mysql.query('id를 조건으로 pw 가져오는 SQL문', [id])
    const isAuth = await bcrypt.compare(pw, comPW)
    if(isAuth){
    const user = await mysql.query('token에 넣을 정보를 가져오는 SQL문')
    done(null, user)
  } else {
    done(null, false)
  }
  } catch(e) {
    done(e)
}

module.exports = () => {
  passport.use('local', new LocalStrategy(passportConfig, localVerify))
};
```

localVerify 함수 안에서 token까지 만들어서 `done()`을 통해 middleware로 넘겨줄 수 있지만, passport convention을 따르는 게 좋습니다.

```js:title=./app.js
// module import 생략
app.post('/login', (req, res) => {
  passport.authenticate(
    'local',
    { session: false }, 
    async (error, user) => {
      if(user){
      const token = await jwt.sign(user, 
        process.env.SECRET_OR_PRIVATE_KEY,
        { expiresIn: "1h" }
      )
      // signOptions에 대해서는 https://www.npmjs.com/package/jsonwebtoken#usage 참고
      res.cookie('jwt',token, { httpOnly: true, maxAge: 3600 })
      // 위의 options에 secure: true를 설정하면 https에서만 사용이 가능합니다.
      // 따라서 ssl을 미리 연동한 게 아니면 개발 단계에서는 비활성화하는 게 좋습니다.
      res.send("verified")
    } else {
      res.send("not found")
    }
  })(req, res)  // 이거 꼭 붙여야 작동합니다.
}
```
여기까지 오면 로그인과 발급 기능은 모두 완성했습니다.

##  jwt 검증 및 갱신
`local-Strategy`가 req.body에 있는 `username`과 `password`를 인증 정보로 참조한다면, `jwt-Strategy`는 암호화된 jwt string을 참조합니다. 문제는 이 때 클라이언트에서 jwt를 어떻게 보내주느냐에 따라 `jwt-Strategy`의 config option이 달라집니다. 호환을 맞추지 않으면 passport에서 참조 대상을 찾지 못하고 verify 함수 자체를 실행하지 못합니다.
여러가지 방법이 있지만 저는 web cookie를 통해서 jwt를 저장 및 교환하므로 cookie를 기준으로 설명하겠습니다.

우선 cookie는 다른 방법들과 달리 미리 준비된 함수가 존재하지 않습니다. 따라서 req.header에서 cookie를 추출하는 함수를 작성한 다음, config option에 추가해야 합니다.

```js:title=./passport.js
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
}
```

여기서 `secretOrKey`는 jwt 토큰을 발급할 때 사용했던 `SECRET_OR_PRIVATE_KEY`와 동일한 키를 사용해야 합니다. 그리고 토큰 발급 시 같이 암호화한 정보들은 복호화되어 payload로 반환됩니다.
단 payload를 반환한다고 해서 해당 token이 인증(authenticate)된 건 아닙니다. payload를 반환했다는 것은 해당 token이 validate하다는 뜻이지, 이게 누구의 토큰인지는 알려줄 수 없습니다. 이 때문에 verity 함수 안에서 mysql과 통신하여 사용자를 식별하고자 할 수 있는데, 보통 페이지가 바뀔 때마다 token을 검증해야 하는 점을 감안하면 이는 페이지가 바뀔 때마다 로그인을 새로 하는 꼴이 됩니다.
이게 비용도 비용이지만 이런 방식을 사용하려면 개인 식별 정보를 token에 저장해야 하기 때문에 굉장히 위험합니다. 그리고 이를 막으려고 개인 식별 정보를 이중으로 암호화하면 결국 복호화되 이중으로 해야하기 때문에 인증 비용이 폭증합니다.

그래서 보통 token에는 개인 식별 정보보다는 서비스 권한 정보(예: 무료 사용자, 유료 사용자 등)를 넣어서 페이지 이동마다 접속 권한을 확인하는 방식으로 JWT를 이용합니다. 다음은 아주 간단한 jwt strategy 코드입니다.

```js:title=./passport.js
async function jwtVerify(payload, done) {
  if(payload){
    return done(null, payload);
  } else {
    return done(null, false)
  }
}
module.exports = () => {
  passport.use('local', new LocalStrategy(passportConfig, localVerify))
};
```

##  jwt 갱신(with refresh token)
나중에 추가