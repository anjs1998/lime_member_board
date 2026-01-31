package com.example.project.board.model.service;

import java.util.Map;

import org.springframework.stereotype.Service;

import com.example.project.board.model.dto.Write;

public interface BoardService {

	Map<String, Object> selectWriteList(int cp);

	Write getBoardDetail(int writeId);

}
