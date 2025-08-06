package com.example.backend.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.example.backend.model.Member;

@Mapper
public interface MemberMapper {
    List<Member> getAllMembers();
    Integer checkId(String memId);
    void registerMember(Member member);
   Member findById(@Param("mem_id") String memId);
}
