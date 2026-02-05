package com.example.project.board.controller;


import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttribute;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;

import com.example.project.board.model.dto.Write;
import com.example.project.board.model.dto.WriteFile;
import com.example.project.board.model.service.BoardService;
import com.example.project.membership.model.dto.Member;

import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
public class BoardController {

	@Autowired
	private BoardService service;
	
	@GetMapping("/board/tables")
	public String boardPage() {
        return "board/tables"; // /WEB-INF/views/board/tables.jsp 렌더링
    }
	@GetMapping("/write/detail")
	public String boardDetail(@RequestParam("postId") int postId) {
        return "board/detail"; 
    }
	@GetMapping("/write/new")
	public String boardWriteNew() {
        return "board/write"; 
    }
	
	@GetMapping("/write/modify")
	public String boardWriteModify(@RequestParam("postId") int postId) {
        return "board/modify"; 
    }
	
	/**게시글 목록 불러오기
	 * @param : */
	@ResponseBody
	@GetMapping("/boardList")
	public List<Map<String, Object>> selectWriteList(@RequestParam(value="cp", required = false, defaultValue = "1") int cp,
			Model model) {
		Map<String, Object> writeMap = null;
		writeMap = service.selectWriteList( cp);
		
		// model에 반환 받은 값 등록
		//model.addAttribute("pagination", writeMap.get("pagination"));
		//model.addAttribute("boardList", writeMap.get("boardList"));
		
		List<Map<String, Object>> resultList = new ArrayList<>();
		resultList.add(writeMap);
		return resultList;
	}
	
	/**게시글 불러오기
	 * 
	 * */
	@ResponseBody
	@GetMapping("/boardDetail")
	public Map<String, Object> getBoardDetail(@RequestParam(value="postId", required = true) long writeId,
			@SessionAttribute(name="loginMember", required=false) Member loginMember) {
		
		
		Write writeDto = service.getBoardDetail(writeId); // Write DTO 조회 
		Map<String, Object> uploadFileMap = service.selectWriteFilesByWriteId(writeId); //WriteFile DTO 조회
		boolean isOwner = (loginMember != null && loginMember.getMemberId() == writeDto.getMemberId());
		return Map.of(
		        "write", writeDto,
		        "uploadFiles", uploadFileMap,
		        "isOwner", isOwner
		    );
		
	}
	
	/**새 게시글 작성
	 * 
	 * @param inputWrite : 새로 작성한 게시글 dto
	 * @param loginMember 
	 * @param files
	 * @return 작성된 게시글의 번호 반환. 0을 반환시 실패로 간주.
	 * */
	@ResponseBody
	@PostMapping("/board/insert")
	public long insertBoardDetail(
			@RequestParam(value="title", required = true) String title, 
			@RequestParam(value="content", required=true) String content,
			@SessionAttribute("loginMember") Member loginMember,
			@RequestParam("uploadFiles") List<MultipartFile> files) throws Exception{
		 
		Write inputWrite = new Write();
		inputWrite.setPostTitle(title);
		inputWrite.setPostContent(content);
		inputWrite.setMemberId(loginMember.getMemberId());
		//inputBoard.setMemberNo(loginMember.getMemberNo());
		
		long boardNo = service.insertBoardDetail(inputWrite, files);
		
		
		return boardNo;
		
	}
	/**게시글 수정
	 * 
	 * @param postIdString 게시글 Id를 String으로 받는 매개변수
	 * @param title 수정된 게시글 제목
	 * @param content 수정된 게시글 내용
	 * @param loginMember  현재 로그인중인 회원 정보
	 * @param files
	 * @param deletedFileIds - 삭제를 원하는 파일의 id를 나열하여 String으로 합쳐서 받는 매개변수.
	 * @param newFiles - 새로 upload된 파일들.
	 * @return 수정된 게시글의 번호 반환. 0을 반환시 실패로 간주.
	 * */
	@ResponseBody
	@PostMapping("/board/modify")
	public long modifyBoardDetail(
			@RequestParam(value="postId", required = true) String postIdString, 
			@RequestParam(value="title", required = true) String title, 
			@RequestParam(value="content", required=true) String content,
			@SessionAttribute("loginMember") Member loginMember,
		    @RequestParam(value="deletedFileIds", required = false) String deletedFileIds, // 얘가 왜 null로 들어오지?
		    @RequestParam(value="newFiles", required = false) List<MultipartFile> newFiles) throws Exception{
		
		
		//String으로 받은 id들을 List<Long>으로 변환.
		List <Long> deletedFileIdList= new ArrayList<Long>();
		if (deletedFileIds != null && !deletedFileIds.isBlank()) {
			deletedFileIdList = Arrays.stream(deletedFileIds.split(","))
		                               .map(Long::parseLong)
		                               .toList();}
		log.debug("deletedFileIds : "+deletedFileIds+ "deletedFileIdList.size() : " + deletedFileIdList.size());
			
		Write inputWrite = new Write();
		//log.debug(postIdString);
		long postId = Long.parseLong(postIdString); // String -> Long 형변환
		inputWrite.setPostId(postId);
		inputWrite.setPostTitle(title);
		inputWrite.setPostContent(content);
		inputWrite.setMemberId(loginMember.getMemberId());
		//inputBoard.setMemberNo(loginMember.getMemberNo());
		long boardNo = service.modifyBoardDetail(inputWrite, newFiles, deletedFileIdList);
		
		
		return boardNo;
		
	}
	
	@ResponseBody
	@PostMapping("/board/delete")
	public long deleteBoardDetail(@RequestParam(value="postId", required = true) long writeId, @SessionAttribute("loginMember") Member loginMember) throws Exception{
		
		long result = service.deleteBoardDetail(writeId);
		
		return result;
		
	}

	/**게시글 첨부파일 다운로드*/
	@GetMapping("/download/file")
	public ResponseEntity<Resource> downloadFile(@RequestParam(value="fileId", required = true) long fileId) throws Exception{
	    
		WriteFile downloadFile = service.selectFileOne(fileId);
		
		String fileNameSaved = downloadFile.getFileNameSaved();
		Path path = Paths.get("C:/upload/" + fileNameSaved);
	    Resource resource = new FileSystemResource(path);

	    return ResponseEntity.ok()
	        .header(HttpHeaders.CONTENT_DISPOSITION,
	            ContentDisposition.attachment()
	                .filename(fileNameSaved, StandardCharsets.UTF_8) // ✅ 한글/특수문자 안전
	                .build()
	                .toString()
	        )
	        .contentLength(Files.size(path))
	        .body(resource);
	}
}
