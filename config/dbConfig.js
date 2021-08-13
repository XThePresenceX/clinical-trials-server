var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "vct_db",
});

connection.connect((err) => {
  if (err) {
    console.error("Database Connection Error: " + err.stack);
  } else {
    console.log("Database Connected: Connection id: " + connection.threadId);
  }
});

module.exports = connection;
