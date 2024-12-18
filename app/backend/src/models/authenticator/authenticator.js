const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  login: {
    type: String,
    required: true,
    unique: true
  },
  googleAuthenticatorSecret: {
    type: String,
    required: false
  }
});

module.exports = mongoose.model('User', userSchema);