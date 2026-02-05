package com.example.project.board.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.example.project.board.model.service.CommentService;

import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
public class CommentController {

	@Autowired
	private CommentService service;
}
