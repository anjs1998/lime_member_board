package com.example.project.board.model.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.project.board.model.dto.Comment;
import com.example.project.board.model.mapper.CommentMapper;

import lombok.extern.slf4j.Slf4j;
@Service
@Transactional(rollbackFor = Exception.class)
@Slf4j
public class CommentServiceImpl implements CommentService{
	@Autowired
	public CommentMapper mapper;
	@Override
	public Comment selectCommentById(long commentId) {
		// TODO Auto-generated method stub
		return mapper.selectCommentById(commentId);
	}
	@Override
	public List<Comment> selectCommentByPostId(long postId) {
		// TODO Auto-generated method stub
		return mapper.selectCommentByPostId(postId);
		// 댓글 트리 구조는 service에서 구현.
	}

	@Override
	public int insertComment(Comment comment) {
		// TODO Auto-generated method stub
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




}
