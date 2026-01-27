package com.example.project.membership.model.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.project.membership.model.dto.Member;
import com.example.project.membership.model.mapper.MembershipMapper;

import lombok.extern.slf4j.Slf4j;
@Transactional(rollbackFor = Exception.class)
@Service // 비즈니스로직 처리 역할 명시 + Bean 등록
@Slf4j
public class MembershipServiceImpl implements MembershipService{

	
	@Autowired
	private MembershipMapper membershipMapper;
	@Autowired
	private BCryptPasswordEncoder bcrypt;
	
	@Override
	public Member login(Member inputMember) {
		
		
		String bcryptPassword = bcrypt.encode(inputMember.getMemberPw());
		log.info("bcryptPassword : " + bcryptPassword);
		Member loginMember = membershipMapper.login(inputMember.getMemberEmail());
		//   두 비밀번호가 일치하는지 확인 (bcrypt.matches(평문, 암호화))
		// 일치하지 않으면
		if(loginMember == null) {return null;}
		if( !bcrypt.matches(inputMember.getMemberPw(), loginMember.getMemberPw()) ) {
			log.info("비밀번호 잘못 입력함!" + loginMember.getMemberNickname());
			return null;
		}
		
		// 로그인 결과에서 비밀번호 제거
		loginMember.setMemberPw(null);
		
		// TODO Auto-generated method stub
		return loginMember;
	}

	@Override
	public boolean isNicknameExists(String memberNickname) {
		// TODO Auto-generated method stub
		if ( membershipMapper.countNickname(memberNickname) > 0 ) {
			return true;
		}else { 
			return false;
		}
	}


	@Override
	public boolean isEmailExists(String memberEmail) {
		// TODO Auto-generated method stub
		if ( membershipMapper.countEmail(memberEmail) > 0 ) {
			return true;
		}else { 
			return false;
		}
	}

	@Override
	public int signup(Member inputMember) {
		// TODO Auto-generated method stub
		
		// 비밀번호 암호화 진행
		
		// inputMember 안의 memberPw -> 평문
		// 비밀번호를 암호화하여 inputMember 세팅
		String pwDecoded = inputMember.getMemberPw();
		String encPw = bcrypt.encode(inputMember.getMemberPw());
		inputMember.setMemberPw(encPw);
		//log.debug("pw:" + pwDecoded +", encPw : " + inputMember.getMemberPw());
		int result = membershipMapper.signup(inputMember);
		//log.debug( Integer.toString(result ) );
		return result;
	}

}
