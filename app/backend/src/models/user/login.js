const db = require('../config/db');

const User = {
  getAll: (callback) => {
    db.query('SELECT * FROM users', (error, results) => {
      if (error) {
        return callback(error, null);
      }
      callback(null, results);
    });
  },
  // Adicione outros métodos conforme necessário
};

module.exports = User;