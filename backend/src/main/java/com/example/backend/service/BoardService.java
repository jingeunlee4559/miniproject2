package com.example.backend.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.backend.mapper.BoardMapper;
import com.example.backend.model.Board;

@Service
public class BoardService {
    @Autowired
    private BoardMapper boardMapper;

    public void createBoard(Board board, MultipartFile board_img, String mem_id) {

        board.setMem_id(mem_id);

        if (board_img != null) {
            // 이미지 저장 처리
        }

        boardMapper.createBoard(board);
    }

    public void deleteBoard(Long boardSeq) {
        boardMapper.deleteBoard(boardSeq);
    }

    public Board getBoard(Long boardSeq) {
        boardMapper.incrementViewCount(boardSeq);
        Board board = boardMapper.findBoardBySeq(boardSeq);
        return board;
    }

    public List<Board> getAllBoards() {
        return boardMapper.getAllBoards();
    }

}
