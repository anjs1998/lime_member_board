package com.example.project.board.model.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;
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
import com.example.project.board.model.mapper.CommentMapper;
import com.example.project.common.util.Utility;

import lombok.extern.slf4j.Slf4j;
@Service
@Transactional(rollbackFor = Exception.class)
@Slf4j
//@PropertySource("classpath:/config.properties")
public class BoardServiceImpl implements BoardService{

	@Autowired
	private BoardMapper boardMapper;
	@Autowired
	private CommentMapper commentMapper;
	
	
	@Value("${file.web-path}")
	private String webPath; // /images/board/
	
	@Value("${file.folder-path}")
	private String folderPath; // C:/upload/
	

	/**
	 * 게시글 List
	 * 
	 * @param cp : 요청이 들어온 pagination 번호*/
	@Override
	public Map<String, Object> selectWriteList(int cp) {
		
		
		// 1. 삭제되지 않은 게시글 갯수 조회
		int listCount = boardMapper.getListCount();
		
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
		List<Write> writeList = boardMapper.selectWriteList(rowBounds);
		
		// 4. 목록 조회 결과 + Pagination 객체를 Map으로 묶어서 반환
		Map<String, Object> map = new HashMap<>();
		
		map.put("pagination", pagination);
		map.put("writeList",writeList);
		
		// 5. 결과 반환
		return map;
	}
	/**글의 Write dto로 제목 불러오기. (***주의*** : 글에 첨부된 file들은 아래의 별도 함수로 불러와야함.) */
	@Override
	public Write getBoardDetail(long writeId) {
		// TODO Auto-generated method stub
		return boardMapper.selectWriteById(writeId);
	}
	
	/**글에 딸린 첨부파일 조회. 향후 기능 확장을 위해 List<WriteFile>을 다시 Map으로 감쌈.*/
	@Override
	public Map<String, Object> selectWriteFilesByWriteId(long writeId) {
		// TODO Auto-generated method stub
		List<WriteFile> files = boardMapper.selectFiles(writeId);
		Map<String, Object> map = new HashMap<>();
		
		map.put("files", files);
		
		return map;
	}

	@Override
	public long insertBoardDetail(Write inputWrite, List<MultipartFile> files) throws Exception {
		// 1. 제목, 본문 삽입 -> newWriteCount 에 삽입된 게시글 개수 return 

		int newWriteCount = boardMapper.insertWrite(inputWrite); //Mybatis 내부 <selectkey>로 inputWrite 내부에 primary key값 자동주입.
		if(newWriteCount == 0) {
			return 0l;
		}
		// 2. 
		long inputWriteId = inputWrite.getPostId();
		
		List<WriteFile> uploadList = new ArrayList<>(); //-> DB 오류로 인해 하나씩 대입하는 insertFileOne() 사용
		int resultCount=0;
		for(int i = 0; i < files.size(); i++) {
			
			if(!files.get(i).isEmpty()) {
				
				String originalName = files.get(i).getOriginalFilename();
				String rename = Utility.fileRename(originalName);
				WriteFile file = WriteFile.builder()
						.fileNameOriginal(originalName)
						.fileNameSaved(rename)
						.path(rename)
						.postId(inputWriteId)
						.uploadFile(files.get(i))
						.build();
				uploadList.add(file); 
				resultCount += boardMapper.insertFileOne(inputWriteId, file); // resultCount == 삽입된 행의 개수(본 for문으로 하나씩 늘어남) == uploadList.size()
				
				log.debug("file inputWriteId: "+file.getPostId());
				
			}
		}
		if(resultCount == 0) {
			return inputWriteId; // 컨트롤러로 현재 제목/상세내용 삽입된 게시글 번호 리턴
		}
		
		// 선택한 파일이 존재할 경우
		// -> "BOARD_IMG" 테이블에 insert + 서버에 파일 저장
		
		
		 //mapper.insertFiles(inputWriteId, uploadList); -> DB 오류로 인해 하나씩 대입하는 insertFileOne() 사용
		
		//if(newWriteCount > =0) {newPostId = mapper.insertFiles(, files);}
		/*		// 삽입 실패 시
		
		}*/
		
		// 다중 INSERT 성공 확인 
		// (uploadList에 저장된 값이 모두 정상 삽입 되었는가)
		if(resultCount == uploadList.size()) {
			
			// todo : 서버에 파일 저장
			for(WriteFile file : uploadList) {
				Path savePath = Paths.get(folderPath, file.getFileNameSaved());
				
				file.getUploadFile().transferTo(savePath.toFile());
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
	public long modifyBoardDetail(Write inputWrite, List<MultipartFile> newFiles, List<Long> deletedFileIds) throws Exception {
		// TODO Auto-generated method stub
		//1. deleteFileIds에서 언급한 파일들 db에서 삭제.
		int deleteResult = 0;
		if(deletedFileIds.size() != 0) deleteResult = deleteFiles(inputWrite.getPostId(), deletedFileIds);
		
		log.debug("deletedFileIds.Size() : " + deletedFileIds.size() +" , " +"deleteResult: " + deleteResult);
		//2. Write 제목, 본문 update(PostId만 그대로 유지)
		boardMapper.updateWrite(inputWrite);
		
		//3. 새 WriteFiles 목록 추가
		if(newFiles.size() != 0) insertFiles(inputWrite.getPostId(), newFiles);
		
		return inputWrite.getPostId();
	}
	
	@Override
	public long deleteBoardDetail(long writeId) throws Exception{
		// TODO Auto-generated method stub
		
		//1. 글에 첨부파일이 있는지 조회
		List<WriteFile> files = boardMapper.selectFiles(writeId);
		if(files.size() == 0) return boardMapper.deleteWriteById(writeId);// 첨부파일 없으면 그냥  //3. 본문 WriteDto 삭제. 로 넘어감
		else {
			//2. 첨부파일 삭제
			List<Long> fileIds = new ArrayList();
			for(WriteFile file : files) {
				
				fileIds.add(file.getFileId());
				
			}
			deleteFiles(writeId, fileIds);
			//3. 본문 WriteDto 삭제.
			return boardMapper.deleteWriteById(writeId);
		}
		
		
		
	}
	
	
	
	
	
	
	/**************************************************************************************************************************/
	@Override
	public WriteFile selectFileOne(long fileId) throws Exception{
		
		return boardMapper.selectFileOne(fileId);
	}
	@Override
	public int insertFiles(long postId, List<MultipartFile> files) throws Exception {
		List<WriteFile> uploadList = new ArrayList<>();
		int resultCount = 0;
		for(int i = 0; i < files.size(); i++) {
					
				if(!files.get(i).isEmpty()) {
					
					String originalName = files.get(i).getOriginalFilename();
					String rename = Utility.fileRename(originalName);
					WriteFile file = WriteFile.builder()
							.fileNameOriginal(originalName)
							.fileNameSaved(rename)
							.path(rename)
							.postId(postId)
							.uploadFile(files.get(i))
							.build();
					uploadList.add(file);
					resultCount += boardMapper.insertFileOne(postId, file);
					log.debug("file inputWriteId: "+file.getPostId());
					
				}
			}
			if(uploadList.isEmpty()) {
				return 0; // 0개 파일 업로드.
			}
			
			// 선택한 파일이 존재할 경우
			// -> "WRITE_FILE" 테이블에 insert + 서버에 파일 저장
			
			// result == 삽입된 행의 개수 == uploadList.size()
			// int result = mapper.insertFiles(postId, uploadList);-> DB 오류로 인해 하나씩 대입하는 insertFileOne() 사용
			
			//if(newWriteCount > =0) {newPostId = mapper.insertFiles(, files);}
			/*		// 삽입 실패 시
			
			}*/
			
			// 다중 INSERT 성공 확인 
			// (uploadList에 저장된 값이 모두 정상 삽입 되었는가)
			if(resultCount == uploadList.size()) {
				
				// todo : 서버에 파일 저장
				for(WriteFile file : uploadList) {
					Path savePath = Paths.get(folderPath, file.getFileNameSaved());
					
					file.getUploadFile().transferTo(savePath.toFile());
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
			return resultCount;
	
	}
	/**실제 컴퓨터 저장공간에 있는 file들의 물리적 삭제 + DB상의 WriteFile dto 정보 삭제.*/
	@Override
	@Transactional
	public int deleteFiles(long postId, List<Long> deletedFileIds) throws Exception {

        if (deletedFileIds == null || deletedFileIds.isEmpty()) {
            return 0;
        }

        // 1️. 삭제 대상 파일 메타 조회
        List<WriteFile> files =
        		boardMapper.selectFilesByPostIdAndFileIds(postId, deletedFileIds);
        // 2. DB 삭제( DB -> 실파일 삭제 순으로 진행해야 DB에서 Exception 발생시 rollback 가능)
        int result = boardMapper.deleteFilesByPostIdAndFileIds(postId, deletedFileIds);
        // 3. 실제 파일 삭제
        for (WriteFile file : files) {
            Path fullPath = Paths.get(
            		folderPath,
                    
                    file.getFileNameSaved()
            );

            try {
                boolean isDeleted = Files.deleteIfExists(fullPath);
                if (!isDeleted) throw new RuntimeException("파일 삭제 실패: " + fullPath);
                log.debug(file.getPath() + file.getFileNameSaved() + " deleted : " + isDeleted);
            } catch (IOException e) {
                throw new RuntimeException("파일 삭제 실패: " + fullPath, e);
            }
        }


        
        //4. 삭제된 파일 개수 return
        return result;
    }

}
