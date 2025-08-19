package com.example.backend.dto.request.Board;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BoardUpdateRequestDTO {
    private String board_title;
    private String board_content;
}
