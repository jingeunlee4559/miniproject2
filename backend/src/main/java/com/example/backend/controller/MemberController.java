package com.example.backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

import com.example.backend.dto.request.Member.MemberLoginRequestDTO;
import com.example.backend.dto.request.Member.MemberRegisterRequestDTO;
import com.example.backend.dto.request.Member.MemberUpdateRequestDTO;
import com.example.backend.dto.request.Member.PasswordVerifyRequestDTO;
import com.example.backend.dto.response.MemberInfoResponseDTO;
import com.example.backend.model.Member;
import com.example.backend.model.MemberRole;
import com.example.backend.service.MemberService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api")
public class MemberController {

    @Autowired
    private MemberService memberService;

    // 로그인
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody MemberLoginRequestDTO requestDTO, HttpServletRequest request) {
        try {
            MemberInfoResponseDTO responseDTO = memberService.login(requestDTO);

            HttpSession session = request.getSession();
            session.setAttribute("loginMember", responseDTO);

            return ResponseEntity.ok(responseDTO);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("아이디 또는 비밀번호가 일치하지 않습니다.");
        }
    }

    // 로그아웃
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {

        session.invalidate();

        return ResponseEntity.ok("로그아웃 되었습니다.");
    }

    // 회원가입
    @PostMapping("/register")
    public ResponseEntity<?> registerMember(@RequestBody MemberRegisterRequestDTO requestDTO) {
        try {
            System.out.println("넘어온 생년월일 값: " + requestDTO.getMem_birth());
            memberService.registerMember(requestDTO);
            return ResponseEntity.ok("회원가입에 성공하였습니다.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("회원가입에 실패하였습니다.");
        }
    }

    // 회원가입 시 사용가능 아이디 확인
    @GetMapping("/register/checkId")
    public ResponseEntity<?> checkIdAvailability(@RequestParam String mem_id) {
        try {
            boolean available = memberService.isIdAvailable(mem_id);
            System.out.println("checkId 호출, mem_id=" + mem_id + ", 사용 가능 여부=" + available);
            return ResponseEntity.ok(available);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(false);
        }
    }

    // 내 정보 조회
    @GetMapping("/me")
    public ResponseEntity<?> getMyProfile(HttpSession session) {
        try {
            MemberInfoResponseDTO loginMember = (MemberInfoResponseDTO)session.getAttribute("loginMember");

            return ResponseEntity.ok(loginMember);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(false);
        }
    }

    // 내 정보 수정
    @PutMapping("/me")
    public ResponseEntity<?> updateMyProfile(HttpSession session, @RequestBody MemberUpdateRequestDTO requestDTO) {
        try {
            MemberInfoResponseDTO loginMember = (MemberInfoResponseDTO)session.getAttribute("loginMember");

            memberService.updateMember(loginMember.getMem_id(), requestDTO);
            return ResponseEntity.ok("정보 변경에 성공하였습니다.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(false);
        }
    }

    // 회원 탈퇴
    @DeleteMapping("/me")
    public ResponseEntity<?> withdrawMyAccount(HttpSession session) {
        try {
            MemberInfoResponseDTO loginMember = (MemberInfoResponseDTO) session.getAttribute("loginMember");

            System.out.println("탈퇴할 멤버 아이디: " + loginMember.getMem_id());

            memberService.withdrawMember(loginMember.getMem_id());
            session.invalidate();
            return ResponseEntity.ok("회원탈퇴에 성공하였습니다.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("회원탈퇴에 실패하였습니다.");
        }
    }

    // 비밀번호 확인
    @PostMapping("/me/password/verify")
    public ResponseEntity<?> verifyMyPassword(HttpSession session, @RequestBody PasswordVerifyRequestDTO requestDTO) {
        try {
            System.out.println("입력 비밀번호 "+ requestDTO.getPassword());
            
            MemberInfoResponseDTO loginMember = (MemberInfoResponseDTO) session.getAttribute("loginMember");
            
            boolean available = memberService.verifyPassword(loginMember.getMem_id(), requestDTO.getPassword());
            System.out.println("verifyMyPassword 호출, mem_id=" + loginMember.getMem_id() + ", 사용 가능 여부=" + available);

            return ResponseEntity.ok(available);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(false);
        }
    }



    // 전체 사용자 목록
    @GetMapping("/members")
    public ResponseEntity<?> getAllMembers() {
        try {
            List<MemberInfoResponseDTO> memberList = memberService.getAllMembers();
            return ResponseEntity.ok(memberList);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(false);
        }
    }

    // 사용자 정보 조회
    @GetMapping("/members/{mem_id}")
    public ResponseEntity<?> getMemberProfile(@PathVariable String mem_id) {
        try {
            MemberInfoResponseDTO responseDTO = memberService.getMember(mem_id);
            return ResponseEntity.ok(responseDTO);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(false);
        }
    }

    // 사용자 정보 수정
    @PutMapping("/members/{mem_id}")
    public ResponseEntity<?> updateMemberProfile(@PathVariable String mem_id, @RequestBody MemberUpdateRequestDTO requestDTO) {
        try {
            memberService.updateMember(mem_id, requestDTO);
            return ResponseEntity.ok("정보 변경에 성공하였습니다.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(false);
        }
    }

    @PutMapping("/members/{mem_id}/suspend")
    public ResponseEntity<?> suspendMember(@PathVariable String mem_id) {
        try {
            memberService.suspendMember(mem_id);
            return ResponseEntity.ok("정지에 성공하였습니다.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(false);
        }
    }

    @PutMapping("/members/{mem_id}/unsuspend")
    public ResponseEntity<?> unsuspendMember(@PathVariable String mem_id) {
        try {
            memberService.unsuspendMember(mem_id);
            return ResponseEntity.ok("정지 해제에 성공하였습니다.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(false);
        }
    }

}
