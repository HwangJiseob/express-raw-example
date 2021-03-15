---
title: proxy server with express
date: 2020-02-23
tags: ["backend", "백엔드", "express", "proxy", "gateway"]
series: express로 백엔드 공부하기
thumbnail: "..."
description: proxy와 gateway의 차이점을 알아보고 http-proxy-middleware를 이용해보자.
---

작은 개발 규모에서는 하나의 서버를 사용하거나, 서버를 분할한다고 해도 보통 `3-Tier Architecture`를 따릅니다. 이는 한국어로 3계층 구조라고 하는데, 서버가 물리적으로 `Presentation Tier`, `Application Tier` 그리고 `Data Tier`로 분할되어 서로 연동되어 있는 구조를 의미합니다. 쉽게 말하자면 프로젝트에서 프론트엔드 서버, 백엔드 서버 그리고 DB 서버 총 3개의 서버를 사용하는 것을 뜻합니다.

# Proxy vs Gateway
Proxy와 Gateway가 비슷한 것 같지만 결정적인 차이가 있습니다. 바로 프로토콜 변환 여부입니다. Proxy 서버는 보통 정해진 프로토콜을 따르는 요청만 중개합니다. 하지만 Gateway의 경우, 만약 백엔드에 요청을 보내줘야 한다면 어떤 프로토콜로 요청이 들어오든 그 요청이 기준을 만족한다면 HTTP로 변환해서 보내줍니다. 둘 다 요청과 응답을 중개해주지만, 프로토콜 변환에 있어서 차이가 있습니다.

이 프로젝트에서는 웹 서버만 다룰 것이므로 Gateway가 아니라 Proxy를 사용하였습니다.

# 프로젝트 서버 구조 초안
Proxy 서버의 목적을 생각하면 프론트엔드 서버를 프록시 서버 외부로 빼는 게 맞지만, 초기에는 프록시 서버를 통해서 프론트엔드 자원에 접근할 수 있도록 설계했습니다. 프로젝트가 학습용 프로젝트인만큼 다양한 시도를 해보고 싶은 차원에서 입니다.

실제 웹서비스에서 인증이나 결제 기능은 외부 api 서버를 통해 구현합니다. 하지만 이 프로젝트에서는 각각 `passport`, `아임포트`를 통해 구현할 계획입니다. db는 mysql을 사용할 계획입니다. nosql이 대세고 MERN이라는 용어가 의미하듯 express를 사용하면 db, 그것도 로컬 db로 mongoDB를 쓰지만 공부용이기 때문에 mysql을 사용할 겁니다. 또한 공부+실험용이기 때문에 배포는 안 할 거라 클라우드 서비스도 연동하지 않을 겁니다.

# proxy 연동
예제 코드는 아래와 같습니다.
```js
const express = require('express')
const { createProxyMiddleware } = require('http-proxy-middleware');
const port = 3000

const google_proxy = createProxyMiddleware({
  target: `https://www.google.com/`,
  changeOrigin: true
})
app.use('/google', google_proxy)

app.listen(port, ()=>{
  console.log(`Proxy server at http://localhost:${port}`)
})
```

nginx처럼 프록시 서버 설정을 시스템 레벨에서 접근할 수는 없기 때문에 이 코드가 사실상 핵심입니다. 다만 제대로 사용하려면 [공식 문서](https://www.npmjs.com/package/http-proxy-middleware#options)의 options 파트를 보는 게 좋습니다.