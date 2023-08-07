const BoardRepository = require('../repositories/board.repository');
class BoardService {
  boardRepository = new BoardRepository();
  createBoard = async (userId, boardName, boardDesc, boardColor) => {
    // 보드 생성
    try {
      if (!boardName) throw new Error('Board 이름을 입력하세요.');

      const exBoard = await this.boardRepository.findBoardByName(boardName);
      // 같은 이름의 보드가 존재하는지 확인
      if (exBoard) throw new Error('이미 존재하는 이름입니다.');

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
      if (!exBoard) throw new Error('존재하지 않는 Board 입니다.');
      return { code: 200, data: exBoard };
    } catch (error) {
      throw error;
    }
  };

  updateBoard = async (userId, boardId, boardName, boardDesc, boardColor) => {
    // 보드 생성
    try {
      if (!boardName) throw new Error('변경할 Board 이름을 입력하세요.');
      const exBoard = await this.boardRepository.findBoardById(boardId);
      if (!exBoard) throw new Error('존재하지 않는 Board 입니다.');
      if (exBoard.userId !== userId) throw new Error('권한이 없습니다.');

      await this.boardRepository.updateBoard(boardId, boardName, boardDesc, boardColor);

      return { code: 200, message: `Board 수정이 완료되었습니다.` };
    } catch (error) {
      throw error;
    }
  };
  deleteBoard = async (userId, boardId) => {
    // 보드 생성
    try {
      const exBoard = await this.boardRepository.findBoardById(boardId);
      if (!exBoard) throw new Error('존재하지 않는 Board 입니다.');
      if (exBoard.userId !== userId) throw new Error('권한이 없습니다.');

      await this.boardRepository.deleteBoard(boardId);

      return { code: 200, message: `Board 삭제가 완료되었습니다.` };
    } catch (error) {
      throw error;
    }
  };
}
module.exports = BoardService;
