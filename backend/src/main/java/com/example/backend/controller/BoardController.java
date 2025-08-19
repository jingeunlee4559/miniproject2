package com.example.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.backend.dto.request.*;
import com.example.backend.dto.request.Board.BoardCreateRequestDTO;
import com.example.backend.dto.request.Board.BoardUpdateRequestDTO;
import com.example.backend.dto.response.*;
import com.example.backend.service.BoardService;

import jakarta.servlet.http.HttpSession;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/board")
public class BoardController {

    @Autowired
    private BoardService boardService;

    // 게시글 생성
    @PostMapping("/create")
    public ResponseEntity<?> createBoard(
            @ModelAttribute BoardCreateRequestDTO requestDTO,
            @RequestParam(required = false) MultipartFile board_img,
            HttpSession session) {

        try {
            MemberInfoResponseDTO loginMember = (MemberInfoResponseDTO)session.getAttribute("loginMember");
            boardService.createBoard(requestDTO, board_img, loginMember.getMem_id());
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(false);
        }
    }

    // 게시글 상세 조회
    @GetMapping("/{boardSeq}")
    public ResponseEntity<?> getPost(@PathVariable Long boardSeq, HttpSession session) {
        // 게시글 상세 조회 로직
        MemberInfoResponseDTO loginMember = (MemberInfoResponseDTO)session.getAttribute("loginMember");
        return ResponseEntity.ok(boardService.getBoard(boardSeq, loginMember));
    }

    // 게시글 삭제
    @DeleteMapping("/{boardSeq}")
    public ResponseEntity<Void> deletePost(@PathVariable Long boardSeq) {
        boardService.deleteBoard(boardSeq);
        return ResponseEntity.noContent().build();
    }

    // 게시글 수정
    @PutMapping("/{boardSeq}")
    public ResponseEntity<Void> updatePost(
            @PathVariable Long boardSeq,
            @ModelAttribute BoardUpdateRequestDTO requestDTO,
            @RequestParam(required = false) MultipartFile board_img,
            HttpSession session) {
        boardService.updateBoard(boardSeq, requestDTO, board_img);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    // 게시글 전체 목록 조회
    @GetMapping("/all")
        public ResponseEntity<?> getBoardList() {

        try {
            return ResponseEntity.ok(boardService.getAllBoards());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(false);
        }
    }
}
