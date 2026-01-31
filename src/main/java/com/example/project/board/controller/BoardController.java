package com.example.project.board.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.example.project.board.model.dto.Write;
import com.example.project.board.model.service.BoardService;

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
        return "board/detail"; // /WEB-INF/views/board/tables.jsp 렌더링
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
	public Write getBoardDetail(@RequestParam(value="postId", required = true) int writeId) {
		
		
		Write result = service.getBoardDetail(writeId);
		
		return result;
		
	}

}
