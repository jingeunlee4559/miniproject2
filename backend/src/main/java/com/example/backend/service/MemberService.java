package com.example.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.backend.mapper.MemberMapper;
import com.example.backend.model.Member;
import com.example.backend.model.MemberRole;

@Service
public class MemberService {

    @Autowired
    private MemberMapper memberMapper;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    public List<Member> getAllMembers() {
        return memberMapper.getAllMembers();
    }

    public void registerMember(Member member) {
        // 비밀번호 암호화
        String encodedPw = passwordEncoder.encode(member.getMem_pw());
        member.setMem_pw(encodedPw);
        member.setMem_role(MemberRole.USER);
        memberMapper.registerMember(member);
    }

    public void updateMember(Member member) {
        String encodedPw = passwordEncoder.encode(member.getMem_pw());
        member.setMem_pw(encodedPw);
        memberMapper.updateMember(member);
    }

    public void withdrawMember(String mem_id) {
        memberMapper.updateMemberRole(mem_id, MemberRole.WITHDRAW);
    }

    public boolean isIdAvailable(String mem_id) {
        return memberMapper.checkId(mem_id) == 0;
    }

    public Member login(String memId, String rawPassword) {
        Member member = memberMapper.findById(memId);

        if (member == null) {
            return null;
        }
        if (!passwordEncoder.matches(rawPassword, member.getMem_pw())) {
            return null;
        }
        if (member.getMem_role() == MemberRole.INACTIVE || member.getMem_role() == MemberRole.WITHDRAW) {
            return null;
        }
        return member;
    }

    public boolean checkPassword(String memId, String rawPassword) {
        Member member = memberMapper.findById(memId);

        if (member == null) {
            return false;
        }

        return passwordEncoder.matches(rawPassword, member.getMem_pw());
    }

    public Member getMember(String memId) {
        Member member = memberMapper.findById(memId);

        return member;
    }
}
