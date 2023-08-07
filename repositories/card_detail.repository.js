const { Comments } = require('../models');
const { Op } = require('sequelize');

class CardDetailRepository {
  /**@댓글생성부분 */
  createComment = async ({ commentText, cardId, userId }) => {
    // Comments테이블에 create method를 통해 객체안의 인자들을 저장
    // sequelize create method를 통해 아래 인자들을 만듬
    return await Comments.create({ cardId: cardId, commentText: commentText, userId: userId });
  };

  /**@댓글조회부분 */
  findComment = async ({ cardId }) => {
    // sequelize findAll method를 통해 where절의 조건으로 cardId가 일치하는것을 찾음
    return await Comments.findAll({ where: { cardId: cardId } });
  };

  /**@댓글수정부분 */
  findByIdComment = async ({ id }) => {
    // 1. sequelize findOne method를 통해 where절에 일치하는 id가 일치하는것을 찾음
    return await Comments.findOne({
      where: { id: id },
    });
  };

  updateComment = async ({ id, commentText, userId }) => {
    // 2. sequelize update method를 통해 Comments모델에서 수정할 컬럼을 선택
    //  where절로 조건을 걸고 [Op.and] 오퍼레이터를 통해 객체안의 id and userId가 같이 일치할때 수정시작
    return await Comments.update({ commentText }, { where: { [Op.and]: [{ id }, { userId }] } });
  };

  /**@댓글삭제부분 */
  deleteComment = async ({ id, userId }) => {
    // 뭐 찾을 필요없이 where절의 조건으로 [Op.and] 를 통해 id와 userId가 동시에 일치할때 삭제시작
    return await Comments.destroy({
      where: { [Op.and]: [{ id }, { userId }] },
    });
  };
}

module.exports = CardDetailRepository;
