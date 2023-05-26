const express = require('express');
const app = express();
const secrets = require("./secrets.json").local;
const mysql = require("mysql");
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(cors());
// application/x-www-form-urlencoded 형식으로 된 데이터를 분석해서 가져올 수 있게 해줌
app.use(bodyParser.urlencoded({ extended: true })); //클라이언트에서 오는 정보를 서버에서 분석해서 가져올 수 있게 해줌
// applicaiton/json 형식의 데이터를 분석해서 가져올 수 있게 해줌
app.use(bodyParser.json());

const connection = mysql.createConnection({
  host: secrets.mysql.host,
  user: secrets.mysql.user,
  password: secrets.mysql.password,
  database: secrets.mysql.database
})
// const connection = mysql.createConnection({
//   host: secrets.mysql.host,
//   user: secrets.mysql.user,
//   password: secrets.mysql.password,
//   database: secrets.mysql.database
// })

connection.connect();
app.set('port', secrets.port);
app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기 중')
})


app.get('/', (req, res) => {
  res.send('Hello, Express')
})

app.get('/users/login01', (req, res) => {

})

/** input:    front에서 넘어온 이름 
 *  function: DB에서 input을 키워드로 검색
 *  return:   이름과 관련된 정보를 json으로 반환
*/
app.get('/main/searchresult/:name', (req, res) => {
  const name = req.params.name;

  let query = "SELECT * FROM landowner where name=\'" +name+ "\' limit 0, 2";
  console.log("name ", name);
  connection.query(query, function (error, result, field){
    if (error){
      console.log(error);
    }
    if (result){
      console.log(result);
      return res.json(result);
    }
  })
})