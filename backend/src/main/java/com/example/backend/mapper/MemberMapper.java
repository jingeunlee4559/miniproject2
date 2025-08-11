package com.example.backend.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.example.backend.model.Member;
import com.example.backend.model.MemberRole;
import com.example.backend.model.MemberStatus;

@Mapper
public interface MemberMapper {
    List<Member> getAllMembers();

    Integer checkId(String memId);

    void registerMember(Member member);

    void updateMember(Member member);
    
    void updateMemberStatus(String mem_id, MemberStatus mem_status);

    void updateMemberRole(String mem_id, MemberRole mem_Role);

    Member findById(@Param("mem_id") String memId);
}
