package com.example.project.board.model.service;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.project.board.model.dto.Write;
import com.example.project.board.model.dto.WriteFile;

public interface BoardService {

	Map<String, Object> selectWriteList(int cp);

	Write getBoardDetail(long writeId);
	
	Map<String, Object> selectWriteFilesByWriteId(long writeId);
	long deleteBoardDetail(long writeId) throws Exception;

	long insertBoardDetail(Write inputWrite, List<MultipartFile> images) throws Exception;

	long modifyBoardDetail(Write inputWrite, List<MultipartFile> newFiles, List<Long> deletedFileIdList)throws Exception;

	/********************************************************/
	WriteFile selectFileOne(long fileId) throws Exception;
	
	int insertFiles(long postId, List<MultipartFile> files) throws Exception;
	
	int deleteFiles(long postId, List<Long> deletedFileIds) throws Exception ;

	

	

}
