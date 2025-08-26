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

    // 로그인
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody MemberLoginRequestDTO requestDTO, HttpServletRequest request) {
        MemberInfoResponseDTO responseDTO = memberService.login(requestDTO, request);
        return ResponseEntity.ok(responseDTO);
    }

    // // 로그아웃
    // @PostMapping("/logout")
    // public ResponseEntity<?> logout(HttpSession session) {

    //     session.invalidate();

    //     return ResponseEntity.ok("로그아웃 되었습니다.");
    // }

    // 회원가입
    @PostMapping("/register")
    public ResponseEntity<?> registerMember(@RequestBody MemberRegisterRequestDTO requestDTO) {
        System.out.println("넘어온 생년월일 값: " + requestDTO.getMem_birth());
        memberService.registerMember(requestDTO);
        return ResponseEntity.ok("회원가입에 성공하였습니다.");
    }

    // 회원가입 시 사용가능 아이디 확인
    @GetMapping("/register/checkId")
    public ResponseEntity<?> checkIdAvailability(@RequestParam String mem_id) {
        boolean available = memberService.isIdAvailable(mem_id);
        System.out.println("checkId 호출, mem_id=" + mem_id + ", 사용 가능 여부=" + available);
        return ResponseEntity.ok(available);
    }

    // #region 내 정보 처리

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
    public ResponseEntity<?> updateMyProfile(@AuthenticationPrincipal CustomUserDetails currentUser, @RequestBody MemberUpdateRequestDTO requestDTO) {
        memberService.updateMember(currentUser.getUsername(), requestDTO);
        return ResponseEntity.ok("정보 변경에 성공하였습니다.");
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

        new SecurityContextLogoutHandler().logout(request, response, SecurityContextHolder.getContext().getAuthentication());
        return ResponseEntity.ok("회원탈퇴에 성공하였습니다.");
    }

    // 비밀번호 확인
    @PostMapping("/me/password/verify")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> verifyMyPassword(@AuthenticationPrincipal CustomUserDetails currentUser, @RequestBody PasswordVerifyRequestDTO requestDTO) {
        boolean available = memberService.verifyPassword(currentUser.getUsername(), requestDTO.getPassword());
        System.out.println("verifyMyPassword 호출, mem_id=" + currentUser.getUsername() + ", 사용 가능 여부=" + available);

        return ResponseEntity.ok(available);
    }
    // #endregion

    // #region 운영자 권한

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
    // #endregion
}
