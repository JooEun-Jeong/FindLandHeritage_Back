## FindLandHeritage_Back
| 땅찾GO 웹의 back입니다. 
### 수행기간: 23.04 ~ 현재
### 프레임워크
: express.js, MySQL
--------------  
### How to start  
1. 필요한 라이브러리 설치하기
``` bash
npm install  
```  
2. config폴더 생성 및 awsSecrets.json라는 파일 생성  
```json
{
  "local": {
    "mysql": {
      "host": "db url",
      "user": "user name",
      "password": "db password",
      "database": "db name"
    },
    "port": "db port"
  },
  "prod": {
    "mysql": {
      "host": "",
      "user": "",
      "password": "",
      "database": ""
    },
    "port": ""
  }
}

```
### 파일 구조  
```
  .
  ├── config/
  |   └── awsSecrets.json
  ├── lib/
  |   └── db.js
  ├── node_modules/
  ├── index.js
  ├── package-lock.json/
  ├── package.json/
  ├── README.md/
  └── .gitignore
```
### 지원하는 기능
#### 1) 조상 이름 검색기능
- input:     조상의 이름
- function:  DB에서 해당되는 토지조사부의 데이터를 검색
- return:    데이터를 json으로 반환
``` json
{
  "NAME": 조상의 이름 (string),
  "CNAME": 조상의 이름 한자 (string),
  "BUYERADDR": 매수자의 주소(string),
  "GOON": 매수한 주소 군(string),
  "LI": 매수한 주소 리(string),
  "JIBUN": 매수한 주소 지번(string),
  "AREA": 매수한 지역 평수(string),
  "ID": 데이터의 고유ID(integer),
}
```
#### 2) 사용자 관리: 로그인/로그아웃 (미완)
- 사용자에 따라 결제 항목 저장
- 구글로그인 / 카카오로그인
#### 3) 결제 시스템 (미완)
- 토스 PG
#### 4) 서버에 연결
- Main: AWS EC2
- DB: AWS RDS
