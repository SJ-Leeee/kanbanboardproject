const BoardRepository = require('../repositories/board.repository');
const CustomError = require('../_utills/customClass');

class BoardService {
  boardRepository = new BoardRepository();
  createBoard = async (userId, boardName, boardDesc, boardColor) => {
    // 보드 생성
    try {
      if (!boardName) throw new CustomError('보드 양식이 올바르지 않습니다.', 412);

      const exBoard = await this.boardRepository.findBoardByName(boardName);
      // 같은 이름의 보드가 존재하는지 확인
      if (exBoard) throw new CustomError('해당 보드가 이미 존재합니다.', 409);
      // 커스텀에러 상속 에러객체를 상속받아 코드번호

      const newBoard = await this.boardRepository.registerBoard(userId, boardName, boardDesc, boardColor);
      // 보드 생성
      return { code: 200, message: `${newBoard.boardName} Board 추가가 완료되었습니다.` };
    } catch (error) {
      throw error;
    }
  };
  getBoard = async (boardId) => {
    // 보드 조회
    try {
      const exBoard = await this.boardRepository.findBoardById(boardId);
      if (!exBoard) throw new CustomError('작성된 보드가 없어 조회에 실패하였습니다.', 403);
      return { code: 200, data: exBoard };
    } catch (error) {
      throw error;
    }
  };

  updateBoard = async (userId, boardId, boardName, boardDesc, boardColor) => {
    try {
      if (!boardName) throw new CustomError('보드 양식이 올바르지 않습니다.', 412);
      const exBoard = await this.boardRepository.findBoardById(boardId);
      if (!exBoard) throw new CustomError('보드가 존재하지 않습니다.', 403);
      if (exBoard.userId !== userId) throw new CustomError('변경 권한이 존재하지 않습니다.', 401);

      await this.boardRepository.updateBoard(boardId, boardName, boardDesc, boardColor);

      return { code: 200, message: `Board 수정이 완료되었습니다.` };
    } catch (error) {
      throw error;
    }
  };
  deleteBoard = async (userId, boardId) => {
    try {
      const exBoard = await this.boardRepository.findBoardById(boardId);
      if (!exBoard) throw new CustomError('보드가 존재하지 않습니다.', 403);
      if (exBoard.userId !== userId) throw new CustomError('변경 권한이 존재하지 않습니다.', 401);

      await this.boardRepository.deleteBoard(boardId);

      return { code: 200, message: `Board 삭제가 완료되었습니다.` };
    } catch (error) {
      throw error;
    }
  };
  addUserToBoard = async (userId, boardId, addUserId) => {
    try {
      if (!addUserId) throw new CustomError('추가 사용자의 값이 없습니다.', 403);
      const exBoard = await this.boardRepository.findBoardById(boardId);
      if (!exBoard) throw new CustomError('보드가 존재하지 않습니다.', 403);
      if (exBoard.userId !== userId) throw new CustomError('유저 추가 권한이 존재하지 않습니다.', 401);
      if (userId === addUserId) throw new CustomError(`본인을 초대할 수 없습니다.`, 409);

      const exUser = await this.boardRepository.findUserById(addUserId);
      if (!exUser) throw new CustomError(`해당 유저가 존재하지 않습니다.`, 409);
      const exUserInBoard = await this.boardRepository.exUserInBoard(boardId, addUserId);
      if (exUserInBoard) throw new CustomError(`이미 ${exBoard.boardName} 에 추가된 유저입니다.`, 409);

      await this.boardRepository.addUserToBoard(boardId, addUserId);

      return { code: 200, message: `정상적으로 추가되었습니다.` };
    } catch (error) {
      throw error;
    }
  };
  deleteUserToBoard = async (userId, boardId, deleteUserId) => {
    try {
      if (!deleteUserId) throw new CustomError('삭제 할 사용자의 값이 없습니다.', 403);
      const exBoard = await this.boardRepository.findBoardById(boardId);
      if (!exBoard) throw new CustomError('보드가 존재하지 않습니다.', 403);
      if (exBoard.userId !== userId) throw new CustomError('유저 추가 권한이 존재하지 않습니다.', 401);

      const exUser = await this.boardRepository.findUserById(deleteUserId);
      if (!exUser) throw new CustomError(`해당 유저가 존재하지 않습니다.`, 409);
      const exUserInBoard = await this.boardRepository.exUserInBoard(boardId, deleteUserId);
      if (!exUserInBoard) throw new CustomError(`보드에 추가되어있지 않은 사용자 입니다.`, 409);

      await this.boardRepository.deleteUserToBoard(boardId, deleteUserId);

      return { code: 200, message: `정상적으로 보드에서 삭제되었습니다.` };
    } catch (error) {
      throw error;
    }
  };
  getMyBoards = async (userId) => {
    try {
      const myBoards = await this.boardRepository.findAllBoardByUserId(userId);

      // const exBoard = await this.boardRepository.findBoardById(boardId);
      // if (!exBoard) throw new CustomError('작성된 보드가 없어 조회에 실패하였습니다.', 403);
      return { code: 200, data: myBoards };
    } catch (error) {
      throw error;
    }
  };

  getAllUsers = async () => {
    try {
      const data = await this.boardRepository.getAllUsers();

      return { code: 200, data };
    } catch (error) {
      throw error;
    }
  };
  getUserInBoard = async (boardId) => {
    try {
      const data = await this.boardRepository.getUserInBoard(boardId);

      return { code: 200, data };
    } catch (error) {
      throw error;
    }
  };
}
module.exports = BoardService;
