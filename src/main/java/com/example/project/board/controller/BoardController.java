package com.example.project.board.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttribute;
import org.springframework.web.multipart.MultipartFile;

import com.example.project.board.model.dto.Write;
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
	public String boardWriteModify() {
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
		
		
		Write writeDto = service.getBoardDetail(writeId);
		boolean isOwner = (loginMember != null && loginMember.getMemberId() == writeDto.getMemberId());
		return Map.of(
		        "write", writeDto,
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
	 * @param inputWrite : 새로 작성한 게시글 dto
	 * @param loginMember 
	 * @param files
	 * @return 작성된 게시글의 번호 반환. 0을 반환시 실패로 간주.
	 * */
	@ResponseBody
	@PostMapping("/board/modify")
	public long modifyBoardDetail(
			@RequestParam(value="postId", required = true) String postIdString, 
			@RequestParam(value="title", required = true) String title, 
			@RequestParam(value="content", required=true) String content,
			@SessionAttribute("loginMember") Member loginMember,
			@RequestParam("images") List<MultipartFile> images) throws Exception{
		
		
		Write inputWrite = new Write();
		
		long postId = Long.parseLong(postIdString); // String -> Long 형변환
		inputWrite.setPostId(postId);
		inputWrite.setPostTitle(title);
		inputWrite.setPostContent(content);
		inputWrite.setMemberId(loginMember.getMemberId());
		//inputBoard.setMemberNo(loginMember.getMemberNo());
		long boardNo = service.insertBoardDetail(inputWrite, images);
		
		
		return boardNo;
		
	}
	
	@ResponseBody
	@PostMapping("/delete")
	public long deleteBoardDetail(@RequestParam(value="postId", required = true) long writeId) {
		
		long result = service.deleteBoardDetail(writeId);
		
		return result;
		
	}

}
