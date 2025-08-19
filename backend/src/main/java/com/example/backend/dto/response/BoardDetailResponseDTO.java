package com.example.backend.dto.response;

import com.example.backend.model.Board;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;


@Getter
@Setter
public class BoardDetailResponseDTO {
    private Long board_seq;
    private String board_title;
    private String board_content;
    private String mem_id;
    private LocalDateTime create_at;
    private LocalDateTime update_at;
    private String imageUrl;

    // 현재 사용자의 권한 정보
    private boolean isEditable;
    private boolean isDeletable;

    public static BoardDetailResponseDTO from(Board board) {
        BoardDetailResponseDTO dto = new BoardDetailResponseDTO();
        dto.setBoard_seq(board.getBoard_seq());
        dto.setBoard_title(board.getBoard_title());
        dto.setBoard_content(board.getBoard_content());
        dto.setMem_id(board.getMem_id());
        dto.setCreate_at(board.getCreate_at());
        dto.setUpdate_at(board.getUpdate_at());
        dto.setImageUrl(board.getStored_fileName());
        return dto;
    }
}

