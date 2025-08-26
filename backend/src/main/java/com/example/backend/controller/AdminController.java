package com.example.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;

import com.example.backend.dto.request.Member.MemberUpdateRequestDTO;
import com.example.backend.dto.response.MemberInfoResponseDTO;
import com.example.backend.service.BoardService;
import com.example.backend.service.CommentService;
import com.example.backend.service.MemberService;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api")
public class AdminController {

    @Autowired
    private MemberService memberService;
    // @Autowired
    // private BoardService boardService;
    // @Autowired
    // private CommentService commentService;

    // 전체 사용자 목록
    @GetMapping("/members")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> getAllMembers() {
        List<MemberInfoResponseDTO> memberList = memberService.getAllMembers();
        return ResponseEntity.ok(memberList);
    }

    // 사용자 정보 조회
    @GetMapping("/members/{mem_id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> getMemberProfile(@PathVariable String mem_id) {
        MemberInfoResponseDTO responseDTO = memberService.getMember(mem_id);
        return ResponseEntity.ok(responseDTO);
    }

    // 사용자 정보 수정
    @PutMapping("/members/{mem_id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> updateMemberProfile(@PathVariable String mem_id,
            @RequestBody MemberUpdateRequestDTO requestDTO) {
        memberService.updateMember(mem_id, requestDTO);
        return ResponseEntity.ok("정보 변경에 성공하였습니다.");
    }

    // 사용자 정지
    @PutMapping("/members/{mem_id}/suspend")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> suspendMember(@PathVariable String mem_id) {
        memberService.suspendMember(mem_id);
        return ResponseEntity.ok("정지에 성공하였습니다.");
    }

    // 사용자 정지 해제
    @PutMapping("/members/{mem_id}/unsuspend")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> unsuspendMember(@PathVariable String mem_id) {
        memberService.unsuspendMember(mem_id);
        return ResponseEntity.ok("정지 해제에 성공하였습니다.");
    }
}
