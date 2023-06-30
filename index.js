const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
// const MySQLStore = require('express-mysql-session')(session);
var FileStore = require('session-file-store')(session);

const app = express();
const secrets = require("./config/awsSecrets.json").local;
const sessionSecret = require("./config/session.json");

// mysql connection 
const connection = require('./lib/db');
connection.connect();

// const sessionStore = new MySQLStore(sessionOptions);

// 세션을 사용할 수 있게 해준다.
app.use(session({
  secret: sessionSecret.secret,
  resave: false, // false - session 데이터가 바뀌기 전까진 session 저장소의 값을 저장하지 않음 / true - 데이터가 바뀌건 바뀌지 않건 계속 저장
  saveUninitialized: true,
  store: new FileStore()
}))

app.use(cors());
// application/x-www-form-urlencoded 형식으로 된 데이터를 분석해서 가져올 수 있게 해줌
app.use(bodyParser.urlencoded({ extended: true })); //클라이언트에서 오는 정보를 서버에서 분석해서 가져올 수 있게 해줌
// applicaiton/json 형식의 데이터를 분석해서 가져올 수 있게 해줌
app.use(bodyParser.json());


///////// ports /////////
app.set('port', secrets.port);
app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기 중')
})

// 메인 라우터
app.get('/', (req, res, next) => {
  console.log(req.session); // app.use session이 자동으로 req 객체로 session을 추가해준다.
  // res.send('Hello, Express');
  res.send(`<a href="http://localhost:3000/auth/google">login</a>`);
})

app.get('/failed', (req, res)=> {
  res.send('login failed.');
})

let passport = require('./lib/passport')(app, connection);

// 인증 라우터
const authRouter = require('./routes/auth')(passport);
app.use('/auth', authRouter);

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
// 아직 체크 안 함
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