---
title: express init
date: 2020-02-23
tags: ["backend", "백엔드", "express"]
series: express로 백엔드 공부하기
thumbnail: "..."
description: express 시작
---

# Web Server와 Web Applicatoin Server
인터넷에 이 둘의 차이점을 검색해보면 웹 서버는 정적 파일을 제공하는 서버고, WAS는 페이지를 동적으로 구성해서 제공하는 서버라고 나옵니다.
그 외에 각 서버를 구동하는 어플리케이션들을 나열하는데, 솔직히 안 써봤으면 무슨 소리인지 잘 와닿지 않습니다.

쉽게 이야기하면 두 서버는 url을 어떻게 사용하는가에 따라 구별할 수 있습니다. 예를 들어 주소창에 `https://example.io/posts/1`을 입력했을 때, 도메인과 매핑된 루트 디렉토리에서 `/posts/1`에 있는 파일들을 모두 전송한다면 이건 web server입니다.
만약 해당 주소를 토대로 db의 posts 테이블에서 1번 레이블 정보를 반환한다면 이건 was입니다. 꼭 db 정보가 아니어도 웹페이지를 구성해서 파일로 반환할 수도 있고 정적 파일을 제공할 수도 있습니다.

WAS는 web server와 web container로 구성되는데, 동적으로 정보를 반환하거나 파일을 구성하는 소프트웨어를 바로 web container라고 합니다.

그렇다면 express는 web server일까요 WAS일까요? express는 WAS 프레임워크입니다.

보통 실무에서 프론트엔드는 정적인 web server로, 백엔드 api 서버는 was로 구성하는데 express는 주로 api 서버로 사용합니다. 프론트엔드와 백엔드 모두 express로 구현할 수 있는데 프론트엔드로는 잘 사용하지 않는 이유는 다음과 같습니다: html 페이지를 동적으로 구성하려면 `pug`, `ejs` 같은 템플릿 엔진을 쓰거나 html 문서의 내용을 template literal로 구성할 수 있는데 전자는 컴포넌트 아키텍쳐를 활용하기가 힘들고, 후자는 코드 에디터에서의 가독성 문제가 대두됩니다.

그래서 컴포넌트 라이브러리(React, Vue 등)을 사용하는 경우에는 보통 express를 api 서버로 씁니다. 사실 react로 빌드한 파일을 express.js에서 미들웨어 함수인 `static`을 이용해서 배포할 수도 있는데, 이는 빌드된 파일에서 다른 디렉토리를 동적으로 참조하지 않을 때 가능합니다. 만약 gatsby처럼 routing마다 보내줘야하는 js 파일이 존재한다면 거기에 일일이 `static` middleware 함수를 설정해줘야 합니다. 게다가 시스템에 안정성 때문에라도 프론트엔드와 백엔드 개발 환경을 물리적으로 일부러 합쳐놓는 건 그리 바람직하지 않습니다. 그리고 그게 아니라면 next처럼 react와 express를 webpack을 통해 하나의 번들로 만들어야 합니다.

# 프로젝트 개요
