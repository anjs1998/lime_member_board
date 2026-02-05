package com.example.project.board.model.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Comment {

    /** 댓글 번호 (PK) */
    private Long commentId;

    /** 댓글 작성 시간 */
    private LocalDateTime commentTime;

    /** 게시글 번호 (FK) */
    private Long postId;

    /** 부모 댓글 번호 (대댓글용, 없으면 null) */
    private Long parentCommentId;

    /** 댓글 내용 */
    private String commentContent;

    /** 삭제일 (소프트 삭제) */
    private LocalDateTime deletedAt;

    /** 작성자 회원 번호 */
    private Long memberId;
    
    /** 작성자 닉네임*/
    private String memberNickname;
}