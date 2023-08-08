const ColumnService = require('../services/column.service');

class ColumnController {
  columnService = new ColumnService();

  // 컬럼 생성 컨트롤러
  createColumn = async (req, res, next) => {
    const { boardId } = req.params;
    const { columnName } = req.body;
    try {
      const createColumnData = await this.columnService.createColumn(boardId, columnName);
      res.status(201).json({ data: createColumnData });
    } catch (err) {
      if (err.message === 'NOT_FOUND_COLUMN_NAME') {
        res.status(412).json({ errorMessage: '생성할 컬럼의 이름을 작성해주세요.' });
      } else {
        res.status(500).json({ errorMessage: '컬럼 생성에 실패하였습니다.' });
      }
    }
  };

  // 컬럼 조회 컨트롤러
  getColumn = async (req, res, next) => {
    const { boardId } = req.params;
    try {
      const columns = await this.columnService.findAllColumn(boardId);
      res.status(200).json({ data: columns });
    } catch (err) {
      console.log(err);
      res.status(500).json({ errorMessage: '컬럼 조회에 실패하였습니다.' });
    }
  };

  // 컬럼명 수정 컨트롤러
  updateColumn = async (req, res, next) => {
    const { boardId, columnId } = req.params;
    const { columnName } = req.body;
    try {
      const updateColumnData = await this.columnService.updateColumn(boardId, columnId, columnName);
      res.status(200).json({ message: `${columnName}으로 컬럼명이 변경되었습니다.`, data: updateColumnData });
    } catch (err) {
      if (err.message === 'NOT_FOUND_COLUMN_NAME') {
        res.status(412).json({ errorMessage: '변경할 컬럼명을 작성해주세요.' });
      } else {
        res.status(500).json({ errorMessage: '컬럼명 수정에 실패하였습니다.' });
      }
    }
  };

  // 컬럼 삭제 컨트롤러
  deleteColumn = async (req, res, next) => {
    const { boardId, columnId } = req.params;
    try {
      await this.columnService.deleteColumn(boardId, columnId);
      res.status(200).json({ message: '컬럼 삭제에 성공하였습니다.' });
    } catch (err) {
      console.log(err);
      res.status(500).json({ errorMessage: '컬럼 삭제에 실패하였습니다.' });
    }
  };
}

module.exports = ColumnController;
