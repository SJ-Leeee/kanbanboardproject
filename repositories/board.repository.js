const { Boards, InvitedUsers } = require('../models');

class BoardRepository {
  findBoardByName = async (boardName) => {
    return await Boards.findOne({ where: { boardName } });
  };
  registerBoard = async (userId, boardName, boardDesc, boardColor) => {
    return await Boards.create({ userId, boardName, boardDesc, boardColor });
  };
  findBoardById = async (boardId) => {
    return await Boards.findOne({ where: { id: boardId } });
  };
  updateBoard = async (boardId, boardName, boardDesc, boardColor) => {
    await Boards.update({ boardName, boardDesc, boardColor }, { where: { id: boardId } });
    return;
  };
  deleteBoard = async (boardId) => {
    await Boards.destroy({ where: { id: boardId } });
    return;
  };

  exUserInBoard = async (boardId, adduserId) => {
    return InvitedUsers.findOne({ where: { userId: adduserId, boardId } });
  };

  addUserToBoard = async (boardId, adduserId) => {
    return InvitedUsers.create({ boardId, userId: adduserId });
  };
}

module.exports = BoardRepository;
