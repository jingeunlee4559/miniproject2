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

    @GetMapping("/all")
    public List<Member> getAllMembers() {
        return memberService.getAllMembers();

    }

    // 로그인
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Member member, HttpServletRequest request) {
        try {
            Member loginUser = memberService.login(member.getMem_id(), member.getMem_pw());
            
            loginUser.setMem_pw(null); // 비밀번호는 응답에서 제거

            HttpSession session = request.getSession();
            session.setAttribute("loginMember", loginUser);

            return ResponseEntity.ok(loginUser);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("아이디 또는 비밀번호가 일치하지 않습니다.");
        }
    }

    // 로그아웃
    @PostMapping("/logout")
    public ResponseEntity<?>  logout(HttpSession session) {
        
        session.invalidate();

        return ResponseEntity.ok("로그아웃 되었습니다.");
    }

    // 회원가입
    @PostMapping("/register")
    public ResponseEntity<?> registerMember(@RequestBody Member member) {
        try {
            memberService.registerMember(member);
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
            Member myProfile = (Member) session.getAttribute("loginMember");

            return ResponseEntity.ok(myProfile);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(false);
        }
    }

    // 내 정보 수정
    @PutMapping("/me")
    public ResponseEntity<?> updateMyProfile(HttpSession session, @RequestBody Member member) {
        try {
            Member myProfile = (Member) session.getAttribute("loginMember");

            member.setMem_id(myProfile.getMem_id());

            memberService.updateMember(member);
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
            Member member = (Member) session.getAttribute("loginMember");

            System.out.println("탈퇴할 멤버 아이디: " + member.getMem_id());

            memberService.withdrawMember(member.getMem_id());
            session.invalidate();
            return ResponseEntity.ok("회원탈퇴에 성공하였습니다.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("회원탈퇴에 실패하였습니다.");
        }
    }

    // 비밀번호 확인
    @PostMapping("/me/password/verify")
    public ResponseEntity<?> verifyMyPassword(HttpSession session, @RequestBody String rawPassword) {
        try {
            Member member = (Member) session.getAttribute("loginMember");
            String mem_id = member.getMem_id();

            boolean available = memberService.verifyPassword(mem_id, rawPassword);
            System.out.println("verifyMyPassword 호출, mem_id=" + mem_id + ", 사용 가능 여부=" + available);
            return ResponseEntity.ok(available);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(false);
        }
    }

    // 사용자 정보 조회
    @GetMapping("/users/{mem_id}")
    public ResponseEntity<?> getUserProfile(@PathVariable String mem_id) {
        try {
            Member user = memberService.getMember(mem_id);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(false);
        }
    }

    // 사용자 정보 수정
    @PutMapping("/users/{mem_id}")
    public ResponseEntity<?> updateUserProfile(@PathVariable String mem_id, @RequestBody Member member) {
        try {
            member.setMem_id(mem_id);

            memberService.updateMember(member);
            return ResponseEntity.ok("정보 변경에 성공하였습니다.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(false);
        }
    }

}
