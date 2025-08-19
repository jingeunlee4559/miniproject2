package com.example.backend.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import com.example.backend.dto.request.*;
import com.example.backend.dto.request.Member.MemberRegisterRequestDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter

public class Member {

  private String mem_id;
  private String mem_pw;
  private String mem_name;
  private String mem_phone;
  private String mem_email;
  private LocalDate mem_birth;
  private String mem_gender;
  private LocalDateTime created_at;
  private MemberRole mem_role;
  private MemberStatus mem_status;

  // 필요한 다른 속성들을 추가할 수 있습니다.
  public Member(String mem_id, String mem_pw) {
    this.mem_id = mem_id;
    this.mem_pw = mem_pw;
  }

  // DTO를 Entity로 변환하는 생성자
  public Member(MemberRegisterRequestDTO dto) {
    this.mem_id = dto.getMem_id();
    this.mem_pw = dto.getMem_pw();
    this.mem_name = dto.getMem_name();
    this.mem_phone = dto.getMem_phone();
    this.mem_email = dto.getMem_email();
    this.mem_birth = dto.getMem_birth();
    this.mem_gender = dto.getMem_gender();
    // 기본값 설정
    this.mem_role = MemberRole.USER;
    this.mem_status = MemberStatus.ACTIVE;
  }
}

// CREATE TABLE MEMBER (
// MEM_ID VARCHAR2(50 BYTE) PRIMARY KEY,
// MEM_PW VARCHAR2(100 BYTE) NOT NULL,
// MEM_NAME VARCHAR2(50 BYTE) NOT NULL,
// MEM_PHONE VARCHAR2(20 BYTE),
// MEM_EMAIL VARCHAR2(100 BYTE),
// MEM_BIRTH DATE,
// MEM_GENDER VARCHAR2(20 BYTE) DEFAULT 'man' NOT NULL
// CREATED_AT TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL,
// MEM_ROLE VARCHAR2(20 BYTE) DEFAULT 'USER' NOT NULL,
// MEM_STATUS VARCHAR2(20 BYTE) DEFAULT 'ACTIVE' NOT NULL,
// );
