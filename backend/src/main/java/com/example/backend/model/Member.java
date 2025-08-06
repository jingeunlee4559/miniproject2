package com.example.backend.model;

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
    private String mem_birth; 
    private String mem_phone;
    private int mem_role;
    private String joined_at;
    private String mem_email;

      // 필요한 다른 속성들을 추가할 수 있습니다.
      public Member(String mem_id, String mem_pw){
        this.mem_id = mem_id;
        this.mem_pw = mem_pw;
    }

}
