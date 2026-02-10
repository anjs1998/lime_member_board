package com.example.project.board.model.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.project.board.model.dto.Comment;
import com.example.project.board.model.mapper.CommentMapper;
import com.example.project.common.util.Utility;

import lombok.extern.slf4j.Slf4j;
@Service
@Transactional(rollbackFor = Exception.class)
@Slf4j
public class CommentServiceImpl implements CommentService{
	@Autowired
	public CommentMapper mapper;
	@Override
	public Map<String, Object> selectCommentById(long commentId) {
		// TODO Auto-generated method stub
		return mapper.selectCommentById(commentId);
	}
	/**게시글에 존재하는 모든 댓글들을 불러오는 함수. (본인 작성여부 저장포함)
	 * @param : postId - 게시글 id
	 * @param : loginMemberId - 본인 작성여부 판별용으로 세션에서 넘겨준 현재 로그인한 유저의 Id
	 * @return Map<String, List<Map<String, Object>>>
	 * */
	@Override
	public Map<String, Object> selectCommentsByPostId(long postId, long loginMemberId) {
		// TODO Auto-generated method stub
		
		List<Map<String, Object>> comments = mapper.selectCommentsByPostId(postId);
		//Comment DTO -> Map<String, Object>로 받음
		
		markMyComments(comments, loginMemberId);
		//각 Comment들의 작성자가 loginMemberId와 일치하는지 비교후 참거짓 여부 저장.
		
		Map<String, Object> map = new HashMap<>();
		
		map.put("comments", comments);
		
		return map;
		// 댓글 트리 구조는 mapper에서 구현.
	}

	/**@return :방금 삽입된 DTO의 id를 return
	 * */
	@Override
	public long insertComment(Comment comment) {
		// 
		return mapper.insertComment(comment);
	}

	@Override
	public int modifyComment(long commentId, String content) {
		// TODO Auto-generated method stub
		return mapper.modifyComment(commentId, content);
	}

	@Override
	public int deleteComment(long commentId) {
		// TODO Auto-generated method stub
		return mapper.deleteComment(commentId);
	}




	/**Comment들의 본인작성 여부를 추가저장하는 함수.*/
	public List<Map<String, Object>> markMyComments(
	        List<Map<String, Object>> comments,
	        Long loginMemberId
	) {
	    // 로그인 안 한 상태면 전부 false 처리
	    if (loginMemberId == null) {
	        for (Map<String, Object> c : comments) {
	            c.put("isOwner", false);
	        }
	        return comments;
	    }

	    for (Map<String, Object> c : comments) {
	        Long writerId = Utility.toLong(c.get("memberId"));

	        boolean isOwner = writerId != null && writerId.equals(loginMemberId);
	        c.put("isOwner", isOwner);
	    }

	    return comments;
	}
	@Override
	public long selectCommentWriter(long commentId) {
	    return mapper.selectCommentWriter(commentId);
	}
}
