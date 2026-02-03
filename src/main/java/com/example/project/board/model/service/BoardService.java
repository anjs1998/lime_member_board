package com.example.project.board.model.service;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.project.board.model.dto.Write;

public interface BoardService {

	Map<String, Object> selectWriteList(int cp);

	Write getBoardDetail(long writeId);
	
	Map<String, Object> selectWriteFilesByWriteId(long writeId);
	long deleteBoardDetail(long writeId);

	long insertBoardDetail(Write inputWrite, List<MultipartFile> images) throws Exception;

}
