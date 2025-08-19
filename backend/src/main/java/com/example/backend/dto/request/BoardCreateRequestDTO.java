package com.example.backend.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BoardCreateRequestDTO {
    private String board_title;
    private String board_content;
    // board_img는 DTO가 아닌 @RequestParam MultipartFile로 직접 받음
    // board_writer, created_at 등은 서버에서 설정
}
