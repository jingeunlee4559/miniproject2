package com.example.backend.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.backend.dto.request.*;
import com.example.backend.dto.response.*;
import com.example.backend.mapper.BoardMapper;
import com.example.backend.model.Board;

@Service
public class BoardService {
    @Autowired
    private BoardMapper boardMapper;

    public void createBoard(BoardCreateRequestDTO requestDTO, MultipartFile board_img, String mem_id) {

        Board board = new Board(requestDTO);
        board.setMem_id(mem_id);

        if (board_img != null) {
            // 이미지 저장 처리
        }

        boardMapper.createBoard(board);
    }

    public void updateBoard(Long boardSeq, BoardUpdateRequestDTO requestDTO, MultipartFile board_img) {

        Board board = boardMapper.findBoardBySeq(boardSeq);
        if (board == null){
            throw new RuntimeException("없는 게시글");
        }

        if (requestDTO.getBoard_title() != null){
            board.setBoard_title(requestDTO.getBoard_title());
        }
        if (requestDTO.getBoard_content() != null){
            board.setBoard_content(requestDTO.getBoard_content());
        }
        
        if (board_img != null) {
            // 이미지 저장 처리
        }

        boardMapper.updateBoard(board);
    }
    
    public void deleteBoard(Long boardSeq) {
        boardMapper.deleteBoard(boardSeq);
    }

    public BoardDetailResponseDTO getBoard(Long boardSeq) {
        Board board = boardMapper.findBoardBySeq(boardSeq);
        boardMapper.incrementViewCount(boardSeq);
        return BoardDetailResponseDTO.from(board);
    }

    public List<BoardListResponseDTO> getAllBoards() {
        List<BoardListResponseDTO> boardList = new ArrayList<>();
        for (var board : boardMapper.getAllBoards()) {
            boardList.add(BoardListResponseDTO.from(board));
        }
        return boardList;
    }



}
