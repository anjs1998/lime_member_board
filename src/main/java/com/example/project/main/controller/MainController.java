package com.example.project.main.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.SessionAttribute;

import com.example.project.membership.model.dto.Member;

@Controller
public class MainController {
	@RequestMapping("/") // 나중에 loginFilter를 만들어서 redirect하게 업데이트
	public String mainPage(
			@SessionAttribute(name = "loginMember", required = false) Member user
			) {
		
		
		if(user == null) return "redirect:/membership/login"; // 로그인이 안되있을떄
		else return "redirect:/board/tables"; // 로그인이 되어있을떄
		
	}
	
	/**LoginFilter로 로그인 안되어있을떄 메인페이지로 리다이렉트*/
	/*
	@GetMapping("loginError")
	public String loginError(RedirectAttributes ra) {
		
		
	}*/
	

}
