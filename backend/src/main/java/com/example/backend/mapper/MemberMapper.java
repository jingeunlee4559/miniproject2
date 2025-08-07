package com.example.backend.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.example.backend.model.Member;
import com.example.backend.model.MemberRole;

@Mapper
public interface MemberMapper {
    List<Member> getAllMembers();

    Integer checkId(String memId);

    void registerMember(Member member);

    void updateMember(Member member);
    
    void updateMemberRole(String mem_id, MemberRole mem_role);

    Member findById(@Param("mem_id") String memId);
}
