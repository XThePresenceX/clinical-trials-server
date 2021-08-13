let db = require('../config/dbConfig');

class Logger {
  async log(source, type, data = []) {
    db.query('INSERT INTO log(source, type, data) VALUES (?,?,?)',
    [source, type, JSON.stringify(data)], (err, rows, fields) => {})
  }
}

const logger = new Logger();
module.exports = logger;
