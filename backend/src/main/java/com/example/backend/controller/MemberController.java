package com.example.backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.Security.CustomUserDetails;
import com.example.backend.dto.request.Member.*;
import com.example.backend.dto.response.MemberInfoResponseDTO;
import com.example.backend.service.MemberService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api")
public class MemberController {

    @Autowired
    private MemberService memberService;

    // 내 정보 조회
    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getMyProfile(@AuthenticationPrincipal CustomUserDetails currentUser) {
        MemberInfoResponseDTO loginMember = MemberInfoResponseDTO.from(currentUser.getMember());
        return ResponseEntity.ok(loginMember);
    }

    // 내 정보 수정
    @PutMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> updateMyProfile(@AuthenticationPrincipal CustomUserDetails currentUser,
            @RequestBody MemberUpdateRequestDTO requestDTO) {
        memberService.updateMember(currentUser.getUsername(), requestDTO);
        return ResponseEntity.ok("정보 변경에 성공하였습니다.");
    }

    // 비밀번호 확인
    @PostMapping("/me/password/verify")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> verifyMyPassword(@AuthenticationPrincipal CustomUserDetails currentUser,
            @RequestBody PasswordVerifyRequestDTO requestDTO) {
        boolean available = memberService.verifyPassword(currentUser.getUsername(), requestDTO.getPassword());
        System.out.println("verifyMyPassword 호출, mem_id=" + currentUser.getUsername() + ", 사용 가능 여부=" + available);
        return ResponseEntity.ok(available);
    }

    // 회원 탈퇴
    @DeleteMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> withdrawMyAccount(
            HttpServletRequest request,
            HttpServletResponse response,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        System.out.println("탈퇴할 멤버 아이디: " + currentUser.getUsername());
        memberService.withdrawMember(currentUser.getUsername());
        new SecurityContextLogoutHandler().logout(request, response,
                SecurityContextHolder.getContext().getAuthentication());
        return ResponseEntity.ok("회원탈퇴에 성공하였습니다.");
    }
}
