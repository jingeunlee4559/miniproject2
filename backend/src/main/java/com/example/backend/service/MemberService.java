package com.example.backend.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.backend.Security.CustomUserDetails;
import com.example.backend.Security.CustomUserDetailsService;
import com.example.backend.dto.request.Member.*;
import com.example.backend.dto.response.*;
import com.example.backend.model.*;
import com.example.backend.mapper.MemberMapper;

@Service
public class MemberService {

    @Autowired
    private MemberMapper memberMapper;

    @Autowired
    private CustomUserDetailsService userDetailsService;
    
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    public List<MemberInfoResponseDTO> getAllMembers() {
        List<MemberInfoResponseDTO> memberInfoList = new ArrayList<>();

        for (var member : memberMapper.getAllMembers()) {
            memberInfoList.add(MemberInfoResponseDTO.from(member));
        }

        return memberInfoList;
    }

    public void registerMember(MemberRegisterRequestDTO requestDTO) {

        Member member = new Member(requestDTO);
        // 비밀번호 암호화
        String encodedPw = passwordEncoder.encode(member.getMem_pw());
        member.setMem_pw(encodedPw);
        member.setMem_status(MemberStatus.ACTIVE);
        member.setMem_role(MemberRole.USER);
        memberMapper.registerMember(member);
    }

    public void updateMember(String mem_id, MemberUpdateRequestDTO requestDTO) {
        Member member = memberMapper.findById(mem_id);

        if (requestDTO.getMem_name() != null) {
            member.setMem_name(requestDTO.getMem_name());
        }
        if (requestDTO.getMem_email() != null) {
            member.setMem_email(requestDTO.getMem_email());
        }
        if (requestDTO.getMem_phone() != null) {
            member.setMem_phone(requestDTO.getMem_phone());
        }

        String encodedPw = passwordEncoder.encode(member.getMem_pw());
        member.setMem_pw(encodedPw);

        memberMapper.updateMember(member);
    }

    public void withdrawMember(String mem_id) {
        memberMapper.updateMemberStatus(mem_id, MemberStatus.WITHDRAWN);
    }

    public void suspendMember(String mem_id) {
        memberMapper.updateMemberStatus(mem_id, MemberStatus.SUSPENDED);
    }

    public void unsuspendMember(String mem_id) {
        memberMapper.updateMemberStatus(mem_id, MemberStatus.ACTIVE);
    }

    public boolean isIdAvailable(String mem_id) {
        return memberMapper.checkId(mem_id) == 0;
    }

    public MemberInfoResponseDTO login(MemberLoginRequestDTO requestDTO) {
        UserDetails userDetails = userDetailsService.loadUserByUsername(requestDTO.getMem_id());

        if (!passwordEncoder.matches(requestDTO.getMem_pw(), userDetails.getPassword())) {
            throw new BadCredentialsException("비밀번호 불일치") ;
        }

        Authentication authentication = new UsernamePasswordAuthenticationToken(
                userDetails, 
                null, 
                userDetails.getAuthorities());

        SecurityContextHolder.getContext().setAuthentication(authentication);
            // 로그 추가 부분
            System.out.println("==========================================================");
            System.out.println("[로그] SecurityContextHolder에 인증 정보 저장 성공");
            System.out.println("저장된 Authentication 객체: " +
 SecurityContextHolder.getContext().getAuthentication());
            System.out.println("인증된 사용자: " + userDetails.getUsername());
            System.out.println("사용자 권한: " + userDetails.getAuthorities());
            System.out.println("==========================================================");
        CustomUserDetails customUserDetails = (CustomUserDetails) userDetails;
        
        return MemberInfoResponseDTO.from(customUserDetails.getMember());
    }

    public boolean verifyPassword(String mem_id, String rawPassword) {
        Member member = memberMapper.findById(mem_id);

        if (member == null) {
            System.out.println("멤버를 찾을수없음");
            return false;
        }

        return passwordEncoder.matches(rawPassword, member.getMem_pw());
    }

    public MemberInfoResponseDTO getMember(String memId) {
        return MemberInfoResponseDTO.from(memberMapper.findById(memId));
    }
}
