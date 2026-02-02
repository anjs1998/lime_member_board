package com.example.project.board.model.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.RowBounds;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.example.project.board.model.dto.Pagination;
import com.example.project.board.model.dto.Write;
import com.example.project.board.model.dto.WriteFile;
import com.example.project.board.model.mapper.BoardMapper;
import com.example.project.common.util.Utility;

import lombok.extern.slf4j.Slf4j;
@Service
@Transactional(rollbackFor = Exception.class)
@Slf4j
//@PropertySource("classpath:/config.properties")
public class BoardServiceImpl implements BoardService{

	@Autowired
	private BoardMapper mapper;
	
	
	
	@Value("${my.board.web-path}")
	private String webPath; // /images/board/
	
	@Value("${my.board.folder-path}")
	private String folderPath; // C:/uploadFiles/board/
	

	/**
	 * 게시글 List
	 * 
	 * @param cp : 요청이 들어온 pagination 번호*/
	@Override
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
	@Override
	public Write getBoardDetail(long writeId) {
		// TODO Auto-generated method stub
		return mapper.selectWriteById(writeId);
	}
	
	@Override
	public long insertBoardDetail(Write inputWrite, List<MultipartFile> files) {
		// 1. 제목, 본문 삽입 -> newWriteCount 에 삽입된 게시글 개수 return 
		
		int newWriteCount = mapper.insertWrite(inputWrite);
		if(newWriteCount == 0) {
			return 0l;
		}
		// 2. 
		long inputWriteId = inputWrite.getPostId();
		
		List<WriteFile> uploadList = new ArrayList<>();
		
		for(int i = 0; i < files.size(); i++) {
			
			if(!files.get(i).isEmpty()) {
				
				String originalName = files.get(i).getOriginalFilename();
				String rename = Utility.fileRename(originalName);
				WriteFile file = WriteFile.builder()
						.fileNameOriginal(originalName)
						.fileNameSaved(rename)
						.path(rename)
						.postId(i)
						.build();
				uploadList.add(file);
				
				
			}
		}
		if(uploadList.isEmpty()) {
			return inputWriteId; // 컨트롤러로 현재 제목/상세내용 삽입된 게시글 번호 리턴
		}
		
		// 선택한 파일이 존재할 경우
		// -> "BOARD_IMG" 테이블에 insert + 서버에 파일 저장
		
		// result == 삽입된 행의 개수 == uploadList.size()
		int result = mapper.insertFiles(uploadList);
		
		//if(newWriteCount > =0) {newPostId = mapper.insertFiles(, files);}
		/*		// 삽입 실패 시
		
		}*/
		
		// 다중 INSERT 성공 확인 
		// (uploadList에 저장된 값이 모두 정상 삽입 되었는가)
		if(result == uploadList.size()) {
			
			// todo : 서버에 파일 저장
			for(WriteFile file : uploadList) {
				//file.getUploadFile().transferTo(new File(folderPath + img.getImgRename()));
			}
			
		} else {
			// 부분적으로 삽입 실패
			// ex) uploadList 에 2개 저장
			// -> 1개 삽입 성공 1개는 실패
			// -> 전체 서비스 실패로 판단
			// -> 이전에 삽입된 내용 모두 rollback
			
			// rollback 하는 방법
			// == RuntimeException 강제 발생 (@Transactional)
			throw new RuntimeException();
		}
		return newWriteCount;
	}
	
	@Override
	public int deleteBoardDetail(long writeId) {
		// TODO Auto-generated method stub
		return mapper.deleteWriteById(writeId);
	}


}
