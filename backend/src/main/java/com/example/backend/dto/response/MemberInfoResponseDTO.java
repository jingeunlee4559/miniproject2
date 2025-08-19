package com.example.backend.dto.response;

import com.example.backend.model.Member;
import com.example.backend.model.MemberRole;
import com.example.backend.model.MemberStatus;

import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class MemberInfoResponseDTO {
    private String mem_id;
    private String mem_name;
    private String mem_email;
    private String mem_phone;
    private MemberRole mem_role;
    private MemberStatus mem_status;

    public static MemberInfoResponseDTO from(Member member) {
        MemberInfoResponseDTO dto = new MemberInfoResponseDTO();
        dto.setMem_id(member.getMem_id());
        dto.setMem_name(member.getMem_name());
        dto.setMem_email(member.getMem_email());
        dto.setMem_phone(member.getMem_phone());
        dto.setMem_role(member.getMem_role());
        dto.setMem_status(member.getMem_status());
        return dto;
    }
}
