package com.example.project.membership.model.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.example.project.membership.model.dto.Member;

@Mapper
public interface MembershipMapper {

	Member login(String inputMemberEmail);

	int countNickname(String memberNickname);

	int countEmail(String memberEmail);

	int signup(Member inputMember);

}
