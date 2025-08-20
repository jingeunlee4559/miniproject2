package com.example.backend.dto.request.Member;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MemberUpdateRequestDTO {
    // 사용자가 직접 수정할 수 있는 정보만 포함
    private String mem_name;
    private String mem_phone;
    private String mem_email;
}
