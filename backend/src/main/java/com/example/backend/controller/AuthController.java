package com.example.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.dto.request.Member.MemberLoginRequestDTO;
import com.example.backend.dto.request.Member.MemberRegisterRequestDTO;
import com.example.backend.dto.response.MemberInfoResponseDTO;
import com.example.backend.service.MemberService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api")
public class AuthController {

    @Autowired
    private MemberService memberService;

    // 로그인
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody MemberLoginRequestDTO requestDTO, HttpServletRequest request) {
        MemberInfoResponseDTO responseDTO = memberService.login(requestDTO, request);
        return ResponseEntity.ok(responseDTO);
    }

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
}
