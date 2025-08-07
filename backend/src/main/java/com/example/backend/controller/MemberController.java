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
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.model.Member;
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

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Member member, HttpServletRequest request) {
        Member loginUser = memberService.login(member.getMem_id(), member.getMem_pw());
        if (loginUser != null) {
            loginUser.setMem_pw(null); // 비밀번호는 응답에서 제거

            HttpSession session = request.getSession();
            session.setAttribute("loginMember", loginUser);

            return ResponseEntity.ok(loginUser);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("아이디 또는 비밀번호가 일치하지 않습니다.");
        }
    }

    @PostMapping("/logout")
    public String logout(HttpSession session) {
        session.getAttribute("loginMember");
        System.out.println("loginMember");
        session.removeAttribute("loginMember");
        return "로그아웃 성공";
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerMember(@RequestBody Member member) {
        try {
            memberService.registerMember(member);
            return ResponseEntity.ok("회원가입에 성공하였습니다.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("회원가입에 실패하였습니다.");
        }
    }

    @PostMapping("/checkPassword")
    public ResponseEntity<?> checkPassword(@RequestBody Map<String, String> requestBody) {

        String mem_id = requestBody.get("memId");
        String rawPassword = requestBody.get("password");

        try {
            boolean available = memberService.checkPassword(mem_id, rawPassword);
            System.out.println("checkPassword 호출, mem_id=" + mem_id + ", 사용 가능 여부=" + available);
            return ResponseEntity.ok(available);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(false);
        }
    }

    @PutMapping("/Myinfo/updateMember/{mem_id}")
    public ResponseEntity<?> UpdateMember(@PathVariable String mem_id, @RequestBody Member member) {
        try {
            member.setMem_id(mem_id);

            memberService.updateMember(member);
            return ResponseEntity.ok("정보 변경에 성공하였습니다.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(false);
        }
    }

    @DeleteMapping("/Myinfo/deleteMember")
    public ResponseEntity<?> withdrawMember(HttpSession session) {
        try {
            Member member = (Member)session.getAttribute("loginMember");

            System.out.println("탈퇴할 멤버 아이디: " + member.getMem_id());

            memberService.withdrawMember(member.getMem_id());
            session.invalidate();
            return ResponseEntity.ok("회원탈퇴에 성공하였습니다.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("회원탈퇴에 실패하였습니다.");
        }
    }

    @GetMapping("/Myinfo/{mem_id}")
    public ResponseEntity<?> getMember(@PathVariable String mem_id) {
        try {
            Member user = memberService.getMember(mem_id);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(false);
        }
    }

    @GetMapping("/checkId/{mem_id}")
    public ResponseEntity<?> checkId(@PathVariable String mem_id) {
        try {
            boolean available = memberService.isIdAvailable(mem_id);
            System.out.println("checkId 호출, mem_id=" + mem_id + ", 사용 가능 여부=" + available);
            return ResponseEntity.ok(available);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(false);
        }
    }
}
