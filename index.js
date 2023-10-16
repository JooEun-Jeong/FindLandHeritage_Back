const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const secrets = require("./config/awsSecrets.json").local;

// mysql connection 
const connection = require('./lib/db');
connection.connect();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

///////////////////////
app.set('port', secrets.port);
app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기 중')
})

// 메인 라우터
app.get('/', (req, res, next) => {
  res.send('Hello, Express');
})

// 검색 라우터
/** input:    front에서 넘어온 이름 
 *  function: DB에서 input을 키워드로 검색
 *  return:   이름과 관련된 정보를 json으로 반환
*/
app.get('/main/searchresult/:name', (req, res) => {
  const name = req.params.name;

  let query = "SELECT * FROM landowner where name=\'" + name + "\';";
  console.log("name ", name);
  connection.query(query, function (error, result, field) {
    if (error) {
      console.log(error);
    }
    if (result) {
      console.log(result);
      return res.json(result);
    }
  })
})

/**
 * input:     front에서 넘어온 이름
 * function:  db에서 input을 키워드로 검색하여 개수를 셈
 * return:    개수 반환
 */
app.get('/main/searchcount/:name', (req, res) => {
  const name = req.params.name;

  let query = "SELECT count(*) as number FROM landowner where name=\'" + name + "\';";
  console.log("count entities with name: ", name);
  connection.query(query, function (error, result, field) {
    if (error) {
      console.log(error);
    }
    if (result) {
      console.log(result);
      return res.send(result);
    }
  })
})

// 잘못된 응답들 처리
app.use((req, res, next) => {
  res.status(404).send('Sorry. this page does not exist.');
})
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
})