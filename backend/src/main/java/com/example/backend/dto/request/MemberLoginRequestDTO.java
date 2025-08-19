package com.example.backend.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MemberLoginRequestDTO {
    private String mem_id;
    private String mem_pw;
}
