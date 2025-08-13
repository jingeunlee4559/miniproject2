package com.example.backend.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.example.backend.model.Board;

@Mapper
public interface BoardMapper {

    void createBoard(Board board);

    void deleteBoard(@Param("board_seq") Long boardSeq);

    Board findBoardBySeq(@Param("board_seq") Long boardSeq);

    void incrementViewCount(@Param("board_seq") Long boardSeq);
    
    List<Board> getAllBoards();

}
