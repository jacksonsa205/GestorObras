const User = require('../../models/user/login');

const userController = {
  getAllUsers: (req, res) => {
    User.getAll((err, users) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.json(users);
    });
  },
  // Adicione outros métodos conforme necessário
};

module.exports = userController;