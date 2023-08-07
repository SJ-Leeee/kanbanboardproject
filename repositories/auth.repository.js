const { Users } = require('../models');

class AuthRepository {
  createUser = async (loginId, password, userName) => {
    const user = await Users.create({ loginId, password, userName });

    return user;
  };

  findUserByLoginId = async (loginId) => {
    const user = await Users.findOne({
      where: { loginId },
    });

    return user;
  };

  findUserByUserId = async (userId) => {
    const user = await Users.findOne({
      where: { id: userId },
    });

    return user;
  };
}

module.exports = AuthRepository;
