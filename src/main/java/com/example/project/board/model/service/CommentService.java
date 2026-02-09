package com.example.project.board.model.service;

import java.util.List;
import java.util.Map;

import com.example.project.board.model.dto.Comment;

public interface CommentService {
	Comment selectCommentById(long commentId);
	Map<String, Object> selectCommentsByPostId(long postId, long loginMemberId);
	int insertComment(Comment comment);
	int modifyComment(long commentId, String content);
	int deleteComment(long commentId);
	long selectCommentWriter(long commentId);
}
