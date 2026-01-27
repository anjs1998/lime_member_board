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
public class Write {

    /** 게시글 번호 (PK) */
    private Long postId;

    /** 게시글 제목 */
    private String postTitle;

    /** 게시글 내용 */
    private String postContent;

    /** 게시글 작성일 */
    private LocalDateTime postDate;

    /** 작성자 회원 번호 */
    private Long memberId;

    /** 삭제일 (소프트 삭제용) */
    private LocalDateTime deletedAt;
}