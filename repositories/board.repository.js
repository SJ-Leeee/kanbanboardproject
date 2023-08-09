const { Boards, InvitedUsers, Users } = require('../models');

class BoardRepository {
  findBoardByName = async (boardName) => {
    return await Boards.findOne({ where: { boardName } });
  };
  registerBoard = async (userId, boardName, boardDesc, boardColor) => {
    return await Boards.create({ userId, boardName, boardDesc, boardColor });
  };
  findBoardById = async (boardId) => {
    return await Boards.findOne({
      attributes: ['boardName', 'createdAt'],
      include: [
        {
          model: Users,
          attributes: ['userName'],
        },
        {
          model: InvitedUsers,
          attributes: ['userId'],
          include: [
            {
              model: Users,
              attributes: ['userName'],
            },
          ],
        },
      ],
      where: { id: boardId },
    });
  };
  updateBoard = async (boardId, boardName, boardDesc, boardColor) => {
    await Boards.update({ boardName, boardDesc, boardColor }, { where: { id: boardId } });
    return;
  };
  deleteBoard = async (boardId) => {
    await Boards.destroy({ where: { id: boardId } });
    return;
  };

  exUserInBoard = async (boardId, addUserId) => {
    return await InvitedUsers.findOne({ where: { userId: addUserId, boardId } });
  };

  addUserToBoard = async (boardId, addUserId) => {
    return await InvitedUsers.create({ boardId, userId: addUserId });
  };

  findUserById = async (addUserId) => {
    return await Users.findOne({ where: { id: addUserId } });
  };

  findAllBoardByUserId = async (userId) => {
    const invitedBoards = await InvitedUsers.findAll({
      attributes: [],
      include: [
        {
          model: Boards,
        },
      ],
      where: { userId },
    });
    const myBoards = await Boards.findAll({ where: { userId } });
    return { invitedBoards, myBoards };
  };
}

module.exports = BoardRepository;
