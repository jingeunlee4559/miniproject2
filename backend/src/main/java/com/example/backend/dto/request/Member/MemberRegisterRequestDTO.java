package com.example.backend.dto.request.Member;

import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MemberRegisterRequestDTO {
    private String mem_id;
    private String mem_pw;
    private String mem_name;
    private String mem_email;
    private LocalDate mem_birth;
    private String mem_gender;
    private String mem_phone;
    // 기타 필요한 가입 정보
}
