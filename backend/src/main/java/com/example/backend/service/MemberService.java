package com.example.backend.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.backend.dto.request.Member.*;
import com.example.backend.dto.response.*;
import com.example.backend.model.*;
import com.example.backend.mapper.MemberMapper;

@Service
public class MemberService {

    @Autowired
    private MemberMapper memberMapper;

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
        Member member = memberMapper.findById(requestDTO.getMem_id());

        if (member == null) {
            return null;
        }
        if (!passwordEncoder.matches(requestDTO.getMem_pw(), member.getMem_pw())) {
            return null;
        }
        if (member.getMem_status() != MemberStatus.ACTIVE) {
            return null;
        }

        return MemberInfoResponseDTO.from(member);
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
