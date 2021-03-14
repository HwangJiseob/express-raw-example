---
title: mysql과 express 연동하기
date: 2020-02-23
tags: ["backend", "백엔드", "express", "mysql", "mysql 설치"]
series: express로 백엔드 공부하기
thumbnail: "..."
description: proxy와 gateway의 차이점을 알아보고 http-proxy-middleware를 이용해보자.
---

[mysql window 64bit](https://dev.mysql.com/downloads/windows/installer/8.0.html) 설치 링크입니다. 모두 default로 설치했습니다. 설치일 기준(2021-03-13) python 3.9는 controller를 지원하지 않았습니다. 공부할 때를 제외하면 python과 mysql을 연동할 일은 아마 취업했는데 그 회사가 그런 스택을 가지고 있지 않는 이상 없을 것 같아서 그냥 넘겼습니다.

예전에 mysql 관리 툴로 `phpmyadmin`을 사용한 적이 있습니다. 그 때는 `phpmyadmin`의 디자인이 너무 구려서 `Workbench`가 낫다고 생각한 적이 있습니다. 그런데 마지막 안정화 버전 배포 날짜를 보니까 `phpmyadmin`은 21년에도 업데이트하고 있지만 `Workbench`는 2015년 이후로 업데이트가 끊겼습니다. 그래도 이번에는 다른 툴을 써보자는 생각으로 `Workbench`를 쓰기로 마음먹었습니다.

참고로 UI 직관성은 `phpmyadmin`이 더 낫다고 생각합니다. 오랜만에 db 공부를 다시 시작해서인지는 모르겠지만 설사 mysql을 안다 하더라도 툴에 대한 학습곡선이 살짝 높은 게 아닌가 싶었습니다.

[phpmyadmin과 workbench를 비교한 영상](https://www.youtube.com/watch?v=VJT1JW4qMHI). 이 영상이 두 관리 툴의 장단점을 비교하지는 않지만, 대충 감이 오실 겁니다. 사실 db 개발을 할 목적이라면 둘 중 어느 것을 사용해도 상관없습니다. 어차피 db 서버를 node js 스크립트로 열기 때문입니다. 정확하게는 커넥션을 만드는 겁니다. 물론 db 서버를 관리 툴에서 열 수도 있지만 대신 관리 툴을 통해서만 접근할 수 있습니다.

DB를 생성하기 전에, 먼저 DB를 연동하겠습니다. mysql을 설치하면 sakila와 world 스키마가 example로 있습니다. 실제 서비스에서는 지워야겠지만 이 친구들을 먼저 연동해본 후에 스키마를 작성할 생각입니다. 사실 백엔드 공부를 하려고 프로젝트를 하고 있지 구체적인 앱을 아직 생각 못해서 스키마를 못 쓰고 있는 게 함정입니다.

# mysql vs mysql2

예전에 mysql도 잘 모르고 node js도 잘 몰랐을 때에는 그냥 `mysql` 모듈 설치하고 코딩을 했었습니다. 그 때 view나 join의 개념도 몰라 백엔드 어플리케이션에서 callback을 엄청 중첩시켰었습니다. 그러다가 `mysql2`의 존재를 알게 된 이후에 코드를 싹 갈아엎었습니다.

제가 callback을 엄청 중첩시킨 건 sql 문법을 몰랐던 것도 있지만 `mysql` 모듈이 Promise 문법을 지원하지 않았기 때문입니다. 그래서 무조건 `mysql2`를 쓰세요.

mysql db에는 모든 서버가 접속가능해야 하기 때문에 root 디렉토리에서 설치합니다.

# schema 설계
sql 문법이나 mysql의 기능을 다루기에 앞서 테이블을 설계해보려고 합니다.

