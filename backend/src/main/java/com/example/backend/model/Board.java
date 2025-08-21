package com.example.backend.model;

import java.time.LocalDateTime;
import com.example.backend.dto.request.Board.BoardCreateRequestDTO;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor

public class Board {

    // DTO를 Entity로 변환하는 생성자
    public Board(BoardCreateRequestDTO dto) {
        this.board_title = dto.getBoard_title();
        this.board_content = dto.getBoard_content();
    }

    Long board_seq;
    String board_title;
    String board_content;
    String mem_id;
    Integer board_views;
    LocalDateTime created_at;
    LocalDateTime updated_at;
    LocalDateTime deleted_at;
    String original_fileName;
    String stored_fileName;
}

// CREATE TABLE BOARD (
//     BOARD_SEQ     NUMBER GENERATED ALWAYS AS IDENTITY,
//     BOARD_TITLE        VARCHAR2(255) NOT NULL,
//     BOARD_CONTENT      CLOB,
//     MEM_ID       VARCHAR2(50) NOT NULL,
//     BOARD_VIEWS   NUMBER DEFAULT 0 NOT NULL,
//     CREATED_AT  TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL,
//     UPDATED_AT  TIMESTAMP DEFAULT NULL,
//     DELETED_AT  TIMESTAMP DEFAULT NULL,
//     ORIGINAL_FILENAME        VARCHAR2(255),
//     STORED_FILENAME        VARCHAR2(255),
//     CONSTRAINT PK_BOARD PRIMARY KEY (BOARD_SEQ),
//     CONSTRAINT FK_BOARD_MEMBER FOREIGN KEY (MEM_ID) REFERENCES MEMBER(MEM_ID)
// );
