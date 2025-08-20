package com.example.backend.controller;

import com.example.backend.dto.request.Comment.*;
import com.example.backend.dto.response.CommentResponseDTO;
import com.example.backend.dto.response.MemberInfoResponseDTO;
import com.example.backend.service.CommentService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api")
public class CommentController {

    @Autowired
    private CommentService commentService;

    // 특정 게시글의 댓글 목록 조회
    @GetMapping("/boards/{boardSeq}/comments")
    public ResponseEntity<?> getComments(@PathVariable Long boardSeq, HttpSession session) {
        try {
            MemberInfoResponseDTO loginMember = (MemberInfoResponseDTO) session.getAttribute("loginMember");
            List<CommentResponseDTO> comments = commentService.getCommentsByBoardSeq(boardSeq, loginMember);
            return ResponseEntity.ok(comments);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("댓글 조회 중 오류가 발생했습니다.");
        }
    }

    // 댓글 생성
    @PostMapping("/boards/{boardSeq}/comments")
    public ResponseEntity<?> createComment(@PathVariable Long boardSeq, @RequestBody CommentCreateRequestDTO requestDto, HttpSession session) {
        try {
            MemberInfoResponseDTO loginMember = (MemberInfoResponseDTO) session.getAttribute("loginMember");
            if (loginMember == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("댓글을 작성하려면 로그인이 필요합니다.");
            }
            commentService.createComment(loginMember.getMem_id(), boardSeq, requestDto);
            return ResponseEntity.status(HttpStatus.CREATED).body("댓글이 성공적으로 작성되었습니다.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // 댓글 수정
    @PutMapping("/boards/{boardSeq}/comments/{commentSeq}")
    public ResponseEntity<?> updateComment(@PathVariable Long commentSeq, @RequestBody CommentUpdateRequestDTO requestDto, HttpSession session) {
        try {
            MemberInfoResponseDTO loginMember = (MemberInfoResponseDTO) session.getAttribute("loginMember");
            if (loginMember == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("댓글을 수정하려면 로그인이 필요합니다.");
            }
            commentService.updateComment(loginMember.getMem_id(), commentSeq, requestDto);
            return ResponseEntity.ok("댓글이 성공적으로 수정되었습니다.");
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // 댓글 삭제
    @DeleteMapping("/boards/{boardSeq}/comments/{commentSeq}")
    public ResponseEntity<?> deleteComment(@PathVariable Long commentSeq, HttpSession session) {
        try {
            MemberInfoResponseDTO loginMember = (MemberInfoResponseDTO) session.getAttribute("loginMember");
            if (loginMember == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("댓글을 삭제하려면 로그인이 필요합니다.");
            }
            commentService.deleteComment(loginMember.getMem_id(), commentSeq);
            return ResponseEntity.noContent().build(); // 성공 시 204 No Content
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}