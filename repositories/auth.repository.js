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

  updateUserLoginId = async (userId, newLoginId) => {
    await Users.update({ loginId: newLoginId }, { where: { id: userId } });
  };

  updateUserPassword = async (userId, newPassword) => {
    await Users.update({ password: newPassword }, { where: { id: userId } });
  };

  updateUserUserName = async (userId, newUserName) => {
    await Users.update({ userName: newUserName }, { where: { id: userId } });
  };
}

module.exports = AuthRepository;
