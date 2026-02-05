package com.example.project.board.model.mapper;

import java.util.List;

import com.example.project.board.model.dto.Comment;

public interface CommentMapper {

	Comment selectCommentById(long commentId);

	List<Comment> selectCommentByPostId(long postId);
	
	int insertComment(Comment comment);

	int modifyComment(long commentId, String content);

	int deleteComment(long commentId);

	
	
}
