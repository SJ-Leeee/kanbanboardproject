const { Columns } = require('../models');
const { Op } = require('sequelize');

class ColumnRepository {
  // 컬럼 생성
  createColumn = async (boardId, columnName) => {
    const createColumnData = await Columns.create({ boardId, columnName });
    // 반환값
    return createColumnData;
  };
  // 컬럼 조회
  getColumn = async (boardId) => {
    const columns = await Columns.findAll({ where: { boardId } });
    // 반환값
    return columns;
  };
  // 컬럼명 수정
  updateColumn = async (boardId, columnId, columnName) => {
    const updateColumnData = await Columns.update(
      { columnName },
      { where: { [Op.and]: [{ boardId }, { id: columnId }] } },
    );
    // 반환값
    return updateColumnData;
  };
  // 컬럼 삭제
  deleteColumn = async (boardId, columnId) => {
    const deleteColumnData = await Columns.destroy({ where: { [Op.and]: [{ boardId }, { id: columnId }] } });
    // 반환값
    return deleteColumnData;
  };
}

module.exports = ColumnRepository;
