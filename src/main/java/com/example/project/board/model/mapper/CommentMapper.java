package com.example.project.board.model.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import com.example.project.board.model.dto.Comment;
@Mapper
public interface CommentMapper {

	Map<String, Object> selectCommentById(long commentId);

	List<Map<String, Object>> selectCommentsByPostId(long postId);
	
	long insertComment(Comment comment);

	int modifyComment(long commentId, String content);

	int deleteComment(long commentId);

	long selectCommentWriter(long commentId);

	
	
}
