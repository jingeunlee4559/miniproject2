package com.example.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.backend.mapper.MemberMapper;
import com.example.backend.model.Member;

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
        memberMapper.registerMember(member);
    }

    public boolean isIdAvailable(String mem_id) {
        return memberMapper.checkId(mem_id) == 0;
    }
   public Member login(String memId, String rawPassword) {
        Member member = memberMapper.findById(memId);
        if (member != null && passwordEncoder.matches(rawPassword, member.getMem_pw())) {
            return member;
        }
        return null;
    }


}
