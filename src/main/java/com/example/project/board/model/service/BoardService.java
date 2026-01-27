package com.example.project.board.model.service;

import java.util.Map;

import org.springframework.stereotype.Service;

public interface BoardService {

	Map<String, Object> selectWriteList(int cp);

}
