const express = require('express');
const router = express.Router();

// 전달받은 요소들을 DB에 저장
module.exports = (db) => {
  router.post('/googleLogin', (req, res) => {
    console.log("this is from GoogleSignUp at front", req.body);
    const { idToken, user } = req.body;
    console.log("idToken: " + idToken);
    console.log("user: " + user);

    // 이미 있는 사용자인지 체크
    let checkIsUserQuery = "select * from users where googleid=\'" + idToken.slice(0, 11) + "\'"
    db.query(checkIsUserQuery, (err, result) => {
      if (result) {
        // 이미 있는 경우
      } else {
        // 없는 사용자일 경우 추가
        let newUserQuery = "INSERT INTO users (email, googleid, appleid, kakaoid) VALUES (?, ?, ?, ?)";
        let newUserParam = [user.email, idToken.slice(0, 11), null, null]
        db.query(newUserQuery, newUserParam, function (err, result) {
          if (err) throw err;
        })
      }
    });
  })

  router.post('/kakaoLogin', (req, res) => {
    console.log("this is from kakaoLogin at front", req.body);
    const { accessToken } = req.body.login;
    const { email } = req.body.profile;
    console.log("accessToken: " + accessToken);
    console.log("userEmail: " + email);

    // 이미 있는 사용자인지 체크
    let checkIsUserQuery = "select * from users where googleid=\'" + idToken.slice(0, 11) + "\'"
    db.query(checkIsUserQuery, (err, result) => {
      if (result) {
        // 이미 있는 경우
      } else {
        // 없는 사용자일 경우 추가
        let newUserQuery = "INSERT INTO users (email, googleid, appleid, kakaoid) VALUES (?, ?, ?, ?)";
        let newUserParam = [user.email, null, null, accessToken.slice(0, 11)]
        db.query(newUserQuery, newUserParam, function (err, result) {
          if (err) throw err;
        })
      }
    });
  })

  return router;
};
