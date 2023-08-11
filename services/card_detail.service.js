const CardDetailRepository = require('../repositories/card_detail.repository');
const { Cards } = require('../models');
const { CustomError } = require('../_utills/customClass');

class CardDetailService {
  cardDetailRepository = new CardDetailRepository();

  /**@댓글생성부분 */
  createComment = async ({ commentText, cardId, userId }) => {
    // cardId 제약조건 오류가 발생하여서  cardId의 유효성검사를 하기위해 코드 추가. (10~17번째줄)
    const isCardIdValid = async (cardId) => {
      const card = await Cards.findOne({ where: { id: cardId } });

      return !!card;
    };
    const cardIdValid = await isCardIdValid(cardId);
    if (!cardIdValid) throw new CustomError('유효하지 않은 카드 ID 입니다.', 404);
    // ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
    if (!userId) throw new CustomError('Id를 찾을수 없습니다. 로그인을 해주세요!', 412);
    if (!commentText) throw new CustomError('텍스트를 입력해주세요', 412);
    const comment = await this.cardDetailRepository.createComment({
      // repository에 있는 createComment에 comment변수값들 저장
      cardId: cardId,
      userId: userId,
      commentText: commentText,
    });

    return { code: 200, data: comment };
  };

  /**@댓글조회부분 */
  findComment = async ({ cardId }) => {
    // 매개변수 :cardId
    const comments = await this.cardDetailRepository.findComment({ cardId }); // 생성자를 통해 cardId에 관련된 댓글목록을 가져옴

    const data = comments.map((comments) => {
      // map을 통해 댓글객체에서 밑에 적은것들을 가져와 data 배열을 만듬
      return {
        cardId: comments.cardId,
        commentText: comments.commentText,
        createdAt: comments.createdAt,
        updatedAt: comments.updatedAt,
      };
    });
    if (!comments) throw new CustomError('카드가 존재하지 않아 댓글을 조회하지 못했습니다.', 412);
    if (!data) throw new CustomError('댓글을 찾을수 없습니다.', 412);
    return { code: 200, data: comments };
  };

  /**@댓글수정부분 */
  updateComment = async ({ id, commentText, userId }) => {
    // {} 객체구조분해할당을 통해 하나의 파라미터로 만듬
    // 1. 수정하기전에 어떤 내용을 수정할지? 수정할 id를 먼저 찾아야함
    const comment = await this.cardDetailRepository.findByIdComment({
      id,
    });
    // 로그인유저ID와 댓글사용자ID가 다를경우
    if (comment.userId !== userId) throw new CustomError('수정권한이 없습니다.', 412);
    if (!comment) throw new CustomError('삭제할 댓글이 없습니다.');
    if (!commentText) throw new CustomError('수정할 댓글을 입력해주세요', 412);
    // 2. 위에서 먼저 찾고 유효성검증을 한 후 수정을 시작
    await this.cardDetailRepository.updateComment({
      id,
      commentText,
      userId,
    });
    return { code: 200, data: comment };
  };

  /**@댓글삭제부분 */
  deleteComment = async ({ id, userId }) => {
    // {} 객체구조분해할당을 통해 하나의 파라미터로 만듬
    // 1. 삭제하기전에 어떤 내용을 삭제할지? 삭제할 id를 먼저 찾아야함
    const comment = await this.cardDetailRepository.findByIdComment({
      id,
    });
    // 로그인유저ID와 댓글사용자ID가 다를경우
    if (comment.userId !== userId) throw new CustomError('삭제권한이 없습니다.', 412);
    if (!comment) throw new CustomError('삭제할 댓글이 없습니다.');
    // 2. 위에서 먼저 찾고 유효성검증을 한 후 삭제 시작
    await this.cardDetailRepository.deleteComment({
      id,
      userId,
    });
    return { code: 200, data: '댓글삭제 성공!' };
  };
}

module.exports = CardDetailService;
