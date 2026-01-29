package com.example.project.membership.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttributes;
import org.springframework.web.bind.support.SessionStatus;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.example.project.membership.model.dto.Member;
import com.example.project.membership.model.service.MembershipService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;

@SessionAttributes({"loginMember"})
//@RequestMapping("member") 
@Controller
@Slf4j
public class MembershipController {
	/*
	private final MembershipService service;
	
	public MembershipController(MembershipService membershipService) {
		
		this.service = membershipService;
	}*/
	@Autowired
	private MembershipService service;
	@GetMapping("/membership/login")
	public String loginPage() {
        return "membership/login"; // ✅ /WEB-INF/views/membership/login.jsp 렌더링
    }
	@GetMapping("/membership/register")
	public String registerPage() {
        return "membership/register"; // ✅ /WEB-INF/views/membership/login.jsp 렌더링
    }
	
	/**login
	 * @param inputMember : 
	 * @param ra
	 * @param model (request scope에 있는 데이터 전달용 객체. @SessionAttributes와 같이 사용시 session scope로 이동함. 
	 * @resp : 쿠키 추가용
	 * **/
	@ResponseBody
	@PostMapping("login")
	public int login(@RequestParam(value="username", required=true)String inputUsername,
			@RequestParam(value="password", required=true)String inputPw,
						
						RedirectAttributes ra,
						Model model,
						@RequestParam(value="save-username", required=false) String saveEmail,
						 HttpServletRequest req,
						HttpServletResponse resp) {
		
		Member inputMember = new Member();
		inputMember.setMemberEmail(inputUsername);
		inputMember.setMemberPw(inputPw);
		Member loginMember = service.login(inputMember);
		
		if(loginMember == null) { // 로그인 실패시
			//ra.addFlashAttribute("message", "이메일 혹은 비밀번호가 실패하였습니다.");
			return 0;
		}else {//로그인 성공시
			
			//model.addAttribute("loginMember", loginMember); // @SessionAttributes를 Controller클래스 위쪽에 달아 Session Scope에도 자동전달
			HttpSession session = req.getSession(true); // ✅ 여기서 세션 먼저 확정 생성
			session.setAttribute("loginMember", loginMember);
			//이메일 저장용 쿠키
			Cookie cookie = new Cookie("saveEmail", loginMember.getMemberEmail());
			cookie.setPath("/"); // 쿠키가 사용될 경로 설정
			
			
			/*todo : 쿠키를 이용해 아이디 저장기능 만들어야함*/
			if (saveEmail != null) {
			    // 30일 유지
			    cookie.setMaxAge(60 * 60 * 24 * 30);
			} else {
			    // 쿠키 삭제
			    cookie.setMaxAge(0);
			}
			
			//resp에 쿠키 추가
			resp.addCookie(cookie);
			
			return 1; // redirect를 안쓸땐, HttpServerRequest를 써야한다. 안그러면 return 전에 session이 생성되지 않는다.
		}
		
		
	}
	/**로그아웃
	 * @param : sessionStatus
	 * 
	 * -> 브라우저가 request를 보낼떄마다 서버측에서 보내는 session id를 매번 첨부해서 보낸다. 
	 * 이걸로 요청된 대상 세션 식별. 
	 * **/
	@GetMapping("logout")
	public String logout(SessionStatus status) {
		
		status.setComplete();
		return "redirect:/";
	}
	/**닉네임 중복체크
	 * 이미 있는 닉네임이면 true, 닉네임이 없으면 false return
	 * **/
	@ResponseBody // 비동기 -> Response 할때 html이 아니라 json으로 
	@PostMapping("checkNickname")
	public boolean checkNicknameExists(@RequestParam("memberNickname") String memberNickname){
		
		boolean result = service.isNicknameExists(memberNickname);
		log.debug("result: " + result);
		return result;
	}
	
	
	
	/**이메일 중복체크
	 * 이미 있는 이메일이면 true, 이메일이 없으면 false return
	 * **/
	@ResponseBody // 비동기 -> Response 할때 html이 아니라 json으로 
	@PostMapping("checkEmailExists")
	public boolean checkEmailExists(@RequestParam("memberEmail") String memberEmail){
		
		return service.isEmailExists(memberEmail);
	}
	
	/**회원가입
	 * 
	 * 
	 * **/
	@ResponseBody
	@PostMapping("signup")
	public int signup(Member inputMember
			){
		int result = service.signup(inputMember);
		
		
		
		//log.debug(Integer.toString(result));
		return result;
		// 성공 -> 1
		// 실패 -> 0?
		
		
	} 
	
}
