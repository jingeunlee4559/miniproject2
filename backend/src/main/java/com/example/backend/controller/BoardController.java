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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.backend.model.Board;
import com.example.backend.model.Member;
import com.example.backend.service.BoardService;

import jakarta.servlet.http.HttpSession;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/board")
public class BoardController {

    @Autowired
    private BoardService boardService;

    @PostMapping("/create")
    public ResponseEntity<?> createBoard(
            @ModelAttribute Board board,
            @RequestParam(required = false) MultipartFile board_img,
            HttpSession session) {

        try {
            Member member = (Member)session.getAttribute("loginMember");
            boardService.createBoard(board, board_img, member.getMem_id());
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(false);
        }
    }

    @GetMapping("/{boardSeq}")
    public ResponseEntity<?> getPost(@PathVariable Long boardSeq) {
        // 게시글 상세 조회 로직
        return ResponseEntity.ok(boardService.getBoard(boardSeq));
    }

    @DeleteMapping("/{boardSeq}")
    public ResponseEntity<Void> deletePost(@PathVariable Long boardSeq) {
        // 게시글 삭제 로직
        boardService.deleteBoard(boardSeq);
        return ResponseEntity.noContent().build();
    }

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
