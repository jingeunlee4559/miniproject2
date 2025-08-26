package com.example.backend.Security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.backend.mapper.MemberMapper;
import com.example.backend.model.Member;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    MemberMapper memberMapper;

    @Override
    public UserDetails loadUserByUsername(String login_id) {

        Member member = memberMapper.findById(login_id);

        if (member == null) {
            throw new UsernameNotFoundException("사용자를 찾을 수 없습니다." + login_id);
        }

        return new CustomUserDetails(member);
    }
}
