const { Columns } = require('../models');
const { Op } = require('sequelize');

class ColumnRepository {
  // 컬럼 생성
  createColumn = async (boardId, columnName) => {
    const columns = await Columns.findOne({ order: [['createdAt', 'DESC']] });
    // 만약 DB에 저장된 데이터가 없어서 null 이 출력된다면?
    let location;
    columns === null ? (location = 0) : (location = columns.location + 1);

    const createColumnData = await Columns.create({ boardId, columnName, location });
    // 반환값
    return createColumnData;
  };
  // 컬럼 조회
  findAllColumn = async (boardId) => {
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
