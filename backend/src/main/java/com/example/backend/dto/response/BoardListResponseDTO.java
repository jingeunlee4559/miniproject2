package com.example.backend.dto.response;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

import com.example.backend.model.Board;

@Getter
@Setter
public class BoardListResponseDTO {
    private Long board_seq;
    private String board_title;
    private String mem_id; // 작성자 ID
    private LocalDateTime create_at;
    private Integer board_views; // 조회수
    private String imageUrl; // 썸네일 이미지 URL

    public static BoardListResponseDTO from(Board board) {
        BoardListResponseDTO dto = new BoardListResponseDTO();
        dto.setBoard_seq(board.getBoard_seq());
        dto.setBoard_title(board.getBoard_title());
        dto.setMem_id(board.getMem_id());
        dto.setCreate_at(board.getCreate_at());
        dto.setBoard_views(board.getBoard_views());
        dto.setImageUrl(board.getStored_fileName()); // 예시: 저장된 파일명을 URL로 활용
        return dto;
    }
}
