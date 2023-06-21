module.exports = function (app, db) {

  var passport = require('passport');
  var GoogleStrategy = require('passport-google-oauth20').Strategy;

  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser(function (user, done) {
    console.log('serializeUser', user);
    done(null, user);
  });

  passport.deserializeUser(function (user, done) {
    // var user = db.get('users').find({
    //     id: id
    // }).value();
    // console.log('deserializeUser', id, user);
    done(null, user);
  });

  var googleCredentials = require('../config/google.json');

  // console.log(googleCredentials.web.client_id);

  passport.use(new GoogleStrategy({
    clientID: googleCredentials.web.client_id,
    clientSecret: googleCredentials.web.client_secret,
    callbackURL: googleCredentials.web.redirect_uris[0]
  },
    function (accessToken, refreshToken, profile, done) {
      // console.log("GoogleStrategy", accessToken, refreshToken, profile);
      // console.log("GoogleStrategy", profile);

      const googleUserId = profile.id % 100000000;
      const email = profile.emails[0].value;
      const name = profile.displayName;

      let findUser = `select * from users where googleid=${googleUserId}`;
      db.query(findUser, function (err, res) {
        // console.log("res", res);
        // res는 배열의 형태로 보내짐
        if (res.length !== 0) {
          // 이미 있는 유저인 경우 고냥 로그인

        }
        // 새로 가입한 유저인 경우
        else {
          let insertUser = `INSERT INTO users(email, name, googleid) VALUES (\'${email}\', \'${name}\', ${googleUserId});`
          db.query(insertUser, function (err, result, field) {
            if (err) {
              console.log("mysql ", err);
            }
            if (result) {
              console.log("user insert success ", result);
              // return result.json(result);
            }
          })
        }
      })
      done(null, googleUserId);
      // User.findOrCreate({
      //   googleId: profile.id
      // }, function (err, user) {
      //   return done(err, user);
      // });
    }
  ));

  app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }));


  // passport 가 authenticate라는 미들웨어로 이동~~
  app.get('/auth/google/callback',
    passport.authenticate('google', {
      // 실패시 어떤 곳으로 갈지??
      failureRedirect: '/failed'
    }), function (req, res) {
      // Successful authentication, redirect home.
      res.redirect('/');
    });
  return passport;
}