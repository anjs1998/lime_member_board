package com.example.project.membership.model.dto;



import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


/**
 * MEMBER 테이블 DTO 
 * - DB 컬럼과 1:1 매핑
 * - 비즈니스 로직 없음(Mybatis가 자동수행)
 */
/*
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder*/
public class Member {
	private Long memberId;              // MEMBER_ID
    private String memberNickname;      // MEMBER_NICKNAME
    private String memberPw;            // MEMBER_PW
    private String memberEmail;         // MEMBER_EMAIL -> ###아이디 대용으로 씀###
    private String memberPhone;         // MEMBER_PHONE
    private String memberAddress;       // MEMBER_ADDRESS
    private String memberAddressSub;    // MEMBER_ADDRESS_SUB
    private Integer memberAddressPostal;// MEMBER_ADDRESS_POSTAL
    private String memberDescription;   // MEMBER_DESCRIPTION
    private String memberIsOut;          // MEMBER_IS_OUT ('Y' / 'N')
    private LocalDateTime memberSignDate;// MEMBER_SIGN_DATE
    public Long getMemberId() {
		return memberId;
	}
	public void setMemberId(Long memberId) {
		this.memberId = memberId;
	}
	public String getMemberNickname() {
		return memberNickname;
	}
	public void setMemberNickname(String memberNickname) {
		this.memberNickname = memberNickname;
	}
	public String getMemberPw() {
		return memberPw;
	}
	public void setMemberPw(String memberPw) {
		this.memberPw = memberPw;
	}
	public String getMemberEmail() {
		return memberEmail;
	}
	public void setMemberEmail(String memberEmail) {
		this.memberEmail = memberEmail;
	}
	public String getMemberPhone() {
		return memberPhone;
	}
	public void setMemberPhone(String memberPhone) {
		this.memberPhone = memberPhone;
	}
	public String getMemberAddress() {
		return memberAddress;
	}
	public void setMemberAddress(String memberAddress) {
		this.memberAddress = memberAddress;
	}
	public String getMemberAddressSub() {
		return memberAddressSub;
	}
	public void setMemberAddressSub(String memberAddressSub) {
		this.memberAddressSub = memberAddressSub;
	}
	public Integer getMemberAddressPostal() {
		return memberAddressPostal;
	}
	public void setMemberAddressPostal(Integer memberAddressPostal) {
		this.memberAddressPostal = memberAddressPostal;
	}
	public String getMemberDescription() {
		return memberDescription;
	}
	public void setMemberDescription(String memberDescription) {
		this.memberDescription = memberDescription;
	}
	public String getMemberIsOut() {
		return memberIsOut;
	}
	public void setMemberIsOut(String memberIsOut) {
		this.memberIsOut = memberIsOut;
	}
	public LocalDateTime getMemberSignDate() {
		return memberSignDate;
	}
	public void setMemberSignDate(LocalDateTime memberSignDate) {
		this.memberSignDate = memberSignDate;
	}
	
	

}