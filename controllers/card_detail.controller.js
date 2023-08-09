const CardDetailService = require('../services/card_detail.service');

class CardDetailController {
  cardDetailService = new CardDetailService();

  /**@댓글생성부분 */
  createComment = async (req, res) => {
    try {
      const { userId } = req.user;
      const cardId = req.params.cardId; //DB에 저장된 cardId를 변수에 담음.
      const { commentText } = req.body;

      const { code, data } = await this.cardDetailService.createComment({ commentText, cardId, userId });

      return res.status(code).json({ data });
    } catch (err) {
      if (err.code) return res.status(err.code).json({ message: err.data });
      console.error(err);
      return res.status(500).json({ message: '댓글 생성에 실패하였습니다.' });
    }
  };

  /**@댓글조회부분 */
  findComment = async (req, res) => {
    try {
      const cardId = req.params.cardId;
      const { code, data } = await this.cardDetailService.findComment({ cardId }); // 생성자를 통해 cardId를 호출하여 조회하고 code,와 data를 가져옴
      return res.status(code).json({ data });
    } catch (err) {
      if (err.code) return res.status(err.code).json({ message: err.data });
      console.error(err);
      return res.status(500).json({ message: '댓글 조회에 실패하였습니다.' });
    }
  };

  /**@댓글수정부분 */
  updateComment = async (req, res) => {
    try {
      const { id } = req.params;
      const { commentText } = req.body;
      const { userId } = req.user;
      const { code, data } = await this.cardDetailService.updateComment({
        // cardDetailService의 updateComment변수에 아래 인자들 저장
        id,
        commentText,
        userId,
      });
      res.status(code).json(data);
    } catch (err) {
      if (err.code) return res.status(err.code).json({ message: err.data });
      console.error(err);
      return res.status(500).json({ message: '댓글 수정에 실패하였습니다.' });
    }
  };

  /**@댓글삭제부분 */
  deleteComment = async (req, res) => {
    try {
      const { id } = req.params;
      const { userId } = req.user; // 하드코딩으로 임시로 userId 4 할당
      const { code, data } = await this.cardDetailService.deleteComment({
        // cardDetailService의 updateComment변수에 아래 인자들 저장
        id,
        userId,
      });
      res.status(code).json(data);
    } catch (err) {
      if (err.code) return res.status(err.code).json({ message: err.data });
      console.error(err);
      return res.status(500).json({ message: '댓글 삭제에 실패하였습니다.' });
    }
  };
}
module.exports = CardDetailController;
