package com.example.backend.controller;

import com.example.backend.Security.CustomUserDetails;
import com.example.backend.dto.request.Comment.*;
import com.example.backend.dto.response.CommentResponseDTO;
import com.example.backend.dto.response.MemberInfoResponseDTO;
import com.example.backend.model.TargetType;
import com.example.backend.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api")
public class CommentController {

    @Autowired
    private CommentService commentService;

    // #region 게시글 댓글 기능

    // 특정 게시글의 댓글 목록 조회
    @GetMapping("/boards/{boardSeq}/comments")
    public ResponseEntity<?> getCommentsForBoard(
            @PathVariable Long boardSeq,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        List<CommentResponseDTO> comments = commentService.getCommentsByTargetSeq(TargetType.BOARD, boardSeq,
                currentUser);
        return ResponseEntity.ok(comments);
    }

    // 댓글 생성
    @PostMapping("/boards/{boardSeq}/comments")
    public ResponseEntity<?> createCommentForBoard(
            @PathVariable Long boardSeq,
            @RequestBody CommentCreateRequestDTO requestDto,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("댓글을 작성하려면 로그인이 필요합니다.");
        }
        CommentResponseDTO responseDTO = commentService.createComment(TargetType.BOARD, boardSeq, currentUser,
                requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
    }
    // #endregion

    // #region 여행지 정보 댓글 기능
        // 특정 게시글의 댓글 목록 조회
    @GetMapping("/category/{categorySeq}/comments")
    public ResponseEntity<?> getCommentsForCategory(
            @PathVariable Long categorySeq,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        List<CommentResponseDTO> comments = commentService.getCommentsByTargetSeq(TargetType.TRAVEL_INFO, categorySeq,
                currentUser);
        return ResponseEntity.ok(comments);
    }

    // 댓글 생성
    @PostMapping("/category/{categorySeq}/comments")
    public ResponseEntity<?> createCommentForCategory(
            @PathVariable Long categorySeq,
            @RequestBody CommentCreateRequestDTO requestDto,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("댓글을 작성하려면 로그인이 필요합니다.");
        }
        CommentResponseDTO responseDTO = commentService.createComment(TargetType.TRAVEL_INFO, categorySeq, currentUser,
                requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
    }
    // #endregion

    // 댓글 수정
    @PutMapping("/comments/{commentSeq}")
    public ResponseEntity<?> updateComment(
            @PathVariable Long commentSeq,
            @RequestBody CommentUpdateRequestDTO requestDto,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        commentService.updateComment(currentUser.getUsername(), commentSeq, requestDto);
        return ResponseEntity.ok("댓글이 성공적으로 수정되었습니다.");
    }

    // 댓글 삭제
    @DeleteMapping("/comments/{commentSeq}")
    public ResponseEntity<?> deleteComment(
            @PathVariable Long commentSeq,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("댓글을 삭제하려면 로그인이 필요합니다.");
        }
        commentService.deleteComment(currentUser.getUsername(), commentSeq);
        return ResponseEntity.noContent().build(); // 성공 시 204 No Content
    }
}