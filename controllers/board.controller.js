const BoardService = require('../services/board.service');
class BoardController {
  boardService = new BoardService();

  createBoard = async (req, res) => {
    // 보드 생성
    try {
      const userId = req.user.userId;
      const { boardColor, boardName, boardDesc } = req.body;
      const result = await this.boardService.createBoard(userId, boardName, boardDesc, boardColor);
      if (result.data) return res.status(result.code).json({ data: result.data });
      return res.status(result.code).json({ message: result.message });
    } catch (err) {
      console.log(err);
      return res.status(err.status).json({ err: err.message });
    }
  };

  getBoard = async (req, res) => {
    // 보드 조회, merge 시키면 카드랑 컬럼까지 조회시키게 해야하나?
    try {
      const { boardId } = req.params;
      const result = await this.boardService.getBoard(boardId);
      if (result.data) return res.status(result.code).json({ data: result.data });
      return res.status(result.code).json({ message: result.message });
      // 오류검증
    } catch (err) {
      console.log(err);
      return res.status(err.status).json({ err: err.message });
    }
  };

  updateBoard = async (req, res) => {
    try {
      const userId = req.user.userId;
      const { boardId } = req.params;
      const { boardName, boardDesc, boardColor } = req.body;
      const result = await this.boardService.updateBoard(userId, boardId, boardName, boardDesc, boardColor);
      if (result.data) return res.status(result.code).json({ data: result.data });
      return res.status(result.code).json({ message: result.message });
    } catch (err) {
      console.log(err);
      return res.status(err.status).json({ err: err.message });
    }
  };

  deleteBoard = async (req, res) => {
    try {
      const userId = req.user.userId;
      const { boardId } = req.params;
      const result = await this.boardService.deleteBoard(userId, boardId);
      if (result.data) return res.status(result.code).json({ data: result.data });
      return res.status(result.code).json({ message: result.message });
    } catch (err) {
      console.log(err);
      return res.status(err.status).json({ err: err.message });
    }
  };
  addUserToBoard = async (req, res) => {
    try {
      const userId = req.user.userId;
      const { boardId } = req.params;
      const { addUserId } = req.body;
      const result = await this.boardService.addUserToBoard(userId, boardId, addUserId);
      if (result.data) return res.status(result.code).json({ data: result.data });
      return res.status(result.code).json({ message: result.message });
    } catch (err) {
      console.log(err);
      return res.status(err.status).json({ err: err.message });
    }
  };

  deleteUserToBoard = async (req, res) => {
    try {
      const userId = req.user.userId;
      const { boardId } = req.params;
      const { deleteUserId } = req.body;
      const result = await this.boardService.deleteUserToBoard(userId, boardId, deleteUserId);
      if (result.data) return res.status(result.code).json({ data: result.data });
      return res.status(result.code).json({ message: result.message });
    } catch (err) {
      console.log(err);
      return res.status(err.status).json({ err: err.message });
    }
  };
  getMyBoards = async (req, res) => {
    try {
      const userId = req.user.userId;
      const result = await this.boardService.getMyBoards(userId);
      if (result.data) return res.status(result.code).json({ data: result.data });
      return res.status(result.code).json({ message: result.message });
    } catch (err) {
      console.log(err);
      return res.status(err.status).json({ err: err.message });
    }
  };
  getAllUsers = async (req, res) => {
    try {
      const result = await this.boardService.getAllUsers();
      if (result.data) return res.status(result.code).json({ data: result.data });
      return res.status(result.code).json({ message: result.message });
    } catch (err) {
      console.log(err);
      return res.status(err.status).json({ err: err.message });
    }
  };

  getUserInBoard = async (req, res) => {
    try {
      const { boardId } = req.params;
      const result = await this.boardService.getUserInBoard(boardId);
      if (result.data) return res.status(result.code).json({ data: result.data });
      return res.status(result.code).json({ message: result.message });
    } catch (err) {
      console.log(err);
      return res.status(err.status).json({ err: err.message });
    }
  };
}
module.exports = BoardController;
