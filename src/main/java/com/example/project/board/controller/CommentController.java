package com.example.project.board.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttribute;

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
}
