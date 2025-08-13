package com.example.backend.model;

import java.time.LocalDateTime;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Board {
    Long board_seq;
    String board_title;
    String board_content;
    String mem_id;
    Integer board_views;
    Boolean board_deleted;
    LocalDateTime board_at;
    String original_fileName;
    String stored_fileName;
}

// CREATE TABLE BOARD (
//     BOARD_SEQ     NUMBER GENERATED ALWAYS AS IDENTITY,
//     BOARD_TITLE        VARCHAR2(255) NOT NULL,
//     BOARD_CONTENT      CLOB,
//     MEM_ID       VARCHAR2(50) NOT NULL,
//     BOARD_VIEWS   NUMBER DEFAULT 0 NOT NULL,
//     BOARD_AT   TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL,
//     BOARD_DELETED   NUMBER(1) DEFAULT 0 NOT NULL,
//     ORIGINAL_FILENAME        VARCHAR2(255),
//     STORED_FILENAME        VARCHAR2(255),
//     CONSTRAINT PK_BOARD PRIMARY KEY (BOARD_SEQ),
//     CONSTRAINT FK_BOARD_MEMBER FOREIGN KEY (MEM_ID) REFERENCES MEMBER(MEM_ID)
// );
