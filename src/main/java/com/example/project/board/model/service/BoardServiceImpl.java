package com.example.project.board.model.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.RowBounds;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.project.board.model.dto.Pagination;
import com.example.project.board.model.dto.Write;
import com.example.project.board.model.mapper.BoardMapper;

import lombok.extern.slf4j.Slf4j;
@Service
@Transactional(rollbackFor = Exception.class)
@Slf4j
public class BoardServiceImpl implements BoardService{

	@Autowired
	private BoardMapper mapper;
	@Override
	/**
	 * 게시글 List
	 * 
	 * @param cp : 요청이 들어온 pagination 번호*/
	public Map<String, Object> selectWriteList(int cp) {
		
		
		// 1. 삭제되지 않은 게시글 갯수 조회
		int listCount = mapper.getListCount();
		
		// 2. 1번 정보를 사용하여 Pagination 객채 생성
		Pagination pagination = new Pagination(cp, listCount);
		
		// 3. 
		/*
		 * ROWBOUNDS 객체 : MyBatis 제공 객체
		 *  : 지정된 크기만큼 건너 뛰고(offset)
		 *  제한된 크기만큼(limit)의 행을 조회하는 객체
		 *  
		 *  --> 페이징 처리가 굉장히 간단해짐
		 *  
		 *  
		 *  
		 * 
		 * 
		 * */
		int limit = pagination.getLimit();//기본 limit : 10개
		int offset = (cp - 1) * limit;
		RowBounds rowBounds = new RowBounds(offset, limit);
		List<Write> writeList = mapper.selectWriteList(rowBounds);
		
		// 4. 목록 조회 결과 + Pagination 객체를 Map으로 묶어서 반환
		Map<String, Object> map = new HashMap<>();
		
		map.put("pagination", pagination);
		map.put("writeList",writeList);
		
		// 5. 결과 반환
		return map;
	}

}
