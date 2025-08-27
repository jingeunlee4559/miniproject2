package com.example.backend.Security;

import java.util.ArrayList;
import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.example.backend.model.Member;
import com.example.backend.model.MemberStatus;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CustomUserDetails implements UserDetails{

    private Member member;

    public CustomUserDetails(Member member) {
        this.member = member;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Collection<GrantedAuthority> collection = new ArrayList<>();
        GrantedAuthority grantedAuthority = new SimpleGrantedAuthority("ROLE_" +
                member.getMem_role());
        collection.add(grantedAuthority);
        return collection;
    }

    @Override
    public String getPassword() {
        return member.getMem_pw();
    }

    @Override
    public String getUsername() {
        return member.getMem_id();
    }

    @Override
    public boolean isEnabled() {
        return member.getMem_status() == MemberStatus.ACTIVE;
    }
    
}
