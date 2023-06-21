const mysql = require("mysql");
const secrets = require("../config/awsSecrets.json").local;

// mysql connection 
const connection = mysql.createConnection({
  host: secrets.mysql.host,
  user: secrets.mysql.user,
  password: secrets.mysql.password,
  database: secrets.mysql.database
})

module.exports = connection;