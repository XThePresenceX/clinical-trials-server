var mysql = require("mysql");

var connection2 = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "users_db",
});

connection2.connect((err) => {
  if (err) {
    console.error("Database Connection Error: " + err.stack);
  } else {
    console.log("Database Connected: Connection id: " + connection2.threadId);
  }
});

module.exports = connection2;
