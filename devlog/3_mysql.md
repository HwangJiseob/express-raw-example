---
title: mysql과 express 연동하기
date: 2020-02-23
tags: ["backend", "백엔드", "express", "mysql", "mysql 설치"]
series: express로 백엔드 공부하기
thumbnail: "..."
description: mysql2와 express 연동하기.
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

# mysql 연동
연동은 사실 쉽습니다. db connection을 만들어도 되는데 보통 pool을 만들어서 connection을 사용합니다. pool은 여러 개의 connection을 미리 만들어두고 요청이 들어올 때마다 나눠주고 다 사용하면 돌려받는 일종의 컨테이너입니다. pool을 생성 시 `connectionLimit`이나 `queueLimit`도 설정해야 하는데 test 단계에서는 안 해도 무방합니다.

다음은 연동한 코드입니다.

```js
const mysql = require('mysql2/promise')

const pool = mysql.createPool({
  host     : 'localhost',
  user     : 'root',
  password : process.env.MYSQL_PW,
  database : "database",
  multipleStatements: true  // 복수의 query문을 보낼 때 반드시 설정
});

app.post('/', async (req, res) => {
  const [ result ] = await pool.query('SELECT * FROM table')
  console.log(result)
  res.send("test")
})
```

# mysql 기능들
##  uuid()
mysql에서 `SEELCT UUID()`를 실행하면 소문자와 숫자가 조합된 32자리 string을 반환합니다. 문제는 이게 앞에 8자리만 랜덤으로 변경되고, 나머지는 바뀌지 않습니다. 따라서 UID는 어플리케이션 단에 생성한 후 INSERT로 저장하는 것이 좋습니다.

##  mysql.format()
mysql.format()은 mysql 다중 쿼리를 처리하기 가장 좋은 기능입니다. 아래와 같이 query문과 parameter를 일목요연하게 array로 정리해서 map이나 forEach로 돌리면 query 변수에 실행가능한 sql 명령들이 하나의 string으로 변환됩니다. 참고로 복수의 쿼리문을 실행하려면 반드시 connection이나 pool을 생성할 때 `multipleStatements`를 `true`로 설정해야 합니다.

`mysql.format()` 예제는 아래와 같습니다.

```js
let query = ''
const sqls = [
  ['INSERT INTO table (col1, col2, ...) VALUES (?, ?, ...);', [param1, param2, ...]],
  ...
]
sqls.map(sql => {
  query += mysql.format(sql[0], sql[1])
} );
```