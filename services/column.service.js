const ColumnRepository = require('../repositories/column.repository');

class ColumnService {
  columnRepository = new ColumnRepository();

  // 컬럼 생성 메서드
  createColumn = async (boardId, columnName) => {
    // 예외처리
    if (!columnName) throw new Error('NOT_FOUND_COLUMN_NAME');
    // 생성요청
    const createColumnData = await this.columnRepository.createColumn(boardId, columnName);
    // 반환값
    return {
      id: createColumnData.id,
      boardId: createColumnData.boardId,
      columnName: createColumnData.columnName,
      createdAt: createColumnData.createdAt,
      updatedAt: createColumnData.updatedAt,
    };
  };

  // 컬럼 조회 메서드
  findAllColumn = async (boardId) => {
    // 컬럼 데이터 요청
    const allColumn = await this.columnRepository.findAllColumn(boardId);
    // 기존 컬럼 순으로 조회
    allColumn.sort((a, b) => {
      return a.createdAt - b.createdAt;
    });
    // 반환값
    return allColumn.map((column) => {
      return {
        id: column.id,
        boardId: column.boardId,
        columnName: column.columnName,
        createdAt: column.createdAt,
        updatedAt: column.updatedAt,
      };
    });
  };

  // 컬럼명 수정 메서드
  updateColumn = async (boardId, columnId, columnName) => {
    // 예외처리
    if (!columnName) throw new Error('NOT_FOUND_COLUMN_NAME');

    const updateColumnData = await this.columnRepository.updateColumn(boardId, columnId, columnName);
    // 반환값
    return {
      id: updateColumnData.id,
      boardId: boardId,
      columnName: updateColumnData.columnName,
      createdAt: updateColumnData.createdAt,
      updatedAt: updateColumnData.updatedAt,
    };
  };

  // 컬럼 삭제 메서드
  deleteColumn = async (boardId, columnId) => {
    await this.columnRepository.deleteColumn(boardId, columnId);
    // 반환값
    return true;
  };
}

module.exports = ColumnService;
