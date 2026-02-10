package com.example.project.board.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttribute;

import com.example.project.board.model.dto.Comment;
import com.example.project.board.model.service.CommentService;
import com.example.project.membership.model.dto.Member;

import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
public class CommentController {

	@Autowired
	private CommentService service;
	
	
	@GetMapping("/comments")
	@ResponseBody
	public Map<String, Object> getCommentsByPostId(@RequestParam(value="postId", required = true) long writeId,
			@SessionAttribute(name="loginMember", required=false) Member loginMember){
		
		long loginMemberId = 0;
		if(loginMember.getMemberId() != null) loginMemberId = loginMember.getMemberId();
		
		Map<String, Object> commentMap = service.selectCommentsByPostId(writeId, loginMemberId);// Comment의 본인 작성여부 boolean 저장을 위한 loginMemberId 매개변수 전달.
		
		return commentMap;
	}
	
	
	  // 1) 댓글 등록
	
	/**
	 * @return : 성공여부 (success), (성공시에만)삽입된 comment 전체 DTO(commentDto) 
	 * **/
    @PostMapping("/comment/insert")
    @ResponseBody
    public Map<String, Object> insertComment(
            @RequestBody Comment inputComment,
            @SessionAttribute("loginMember") Member loginMember
    ) {
    	
        Comment comment = new Comment(); 
        
        comment.setPostId(inputComment.getPostId());
        comment.setParentCommentId(inputComment.getParentCommentId());
        comment.setCommentContent(inputComment.getCommentContent());
        comment.setMemberId(loginMember.getMemberId());
        comment.setMemberNickname(loginMember.getMemberNickname());
        
        log.debug("inputComment : " + comment.toString());
        long result = service.insertComment(comment);
        
        if(result > 0) {
        	log.debug("comment.getCommentId() : " + comment.getCommentId());
            Map<String, Object> newComment = service.selectCommentById(comment.getCommentId());
            newComment.put("isOwner", true);
            return Map.of(
                    "success", true,
                    "newComment", newComment
            );
        
        }else {
        	return Map.of(
                        "success", false,
                        "message", "처리에 실패했습니다."
                    );
        	
        }

    }

    // 2) 댓글 수정
    @PostMapping("/comment/modify")
    public ResponseEntity<Map<String, Object>> modifyComment(
            @PathVariable(value="commentId", required = true) long commentId,
            @RequestBody Comment inputComment,
            @SessionAttribute("loginMember") Member loginMember
    ) {
        
    	
        long loginMemberId = loginMember.getMemberId();

        // 🔐 작성자 조회
        long writerId = service.selectCommentWriter(commentId);
        if (writerId != loginMemberId) {
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(Map.of(
                            "success", false,
                            "message", "댓글 수정 권한이 없습니다."
                    ));
        }
        int result = service.modifyComment(commentId, inputComment.getCommentContent());
        if(result > 0) {
            Map<String, Object> newComment = service.selectCommentById(inputComment.getCommentId());
            newComment.put("isOwner", true);
            return ResponseEntity.ok(
                    Map.of(
                            "success", result > 0,
                            "newComment", newComment
                    )
            );
        
        }else {
        	return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(Map.of(
                            "success", false,
                            "message", "처리에 실패했습니다."
                        ));
            	
        	
        }
    }
    
    // 3) 댓글 삭제
    @PostMapping("/comment/delete")
    public ResponseEntity<Map<String, Object>> deleteComment (
            @PathVariable(value="commentId", required = true) long commentId,
            @SessionAttribute("loginMember") Member loginMember
    ) {
    	
        long loginMemberId = loginMember.getMemberId();

        // 🔐 작성자 조회
        long writerId = service.selectCommentWriter(commentId);

        // 🔒 권한 없음
        if (writerId != loginMemberId) {
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(Map.of(
                            "success", false,
                            "message", "댓글 삭제 권한이 없습니다."
                    ));
        }
        int result = service.deleteComment(commentId);
        
        if(result > 0) {

            return ResponseEntity.ok(
                    Map.of(
                            "success", result > 0,
                            "result", result
                    )
            );
        	
        }else {
        	return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                        "success", false,
                        "message", "처리에 실패했습니다."
                    ));
        	
        }

    }
}
