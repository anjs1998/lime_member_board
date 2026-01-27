package com.example.project.membership.model.service;

import org.springframework.stereotype.Service;

import com.example.project.membership.model.dto.Member;

@Service
public interface MembershipService {

	public Member login(Member inputMember);

	public boolean isNicknameExists(String memberEmail);

	public boolean isEmailExists(String memberEmail);
	
	public int signup(Member inputMember);


	
	
}
