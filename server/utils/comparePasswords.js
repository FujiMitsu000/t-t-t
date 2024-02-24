const bcrypt = require('bcrypt');

isValidPassword = function(user, password){
    return bcrypt.compareSync(password, user.password);
  }

module.exports = {
    isValidPassword
};