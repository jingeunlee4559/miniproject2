// src/main/java/com/example/backend/controller/HelloController.java
package com.example.backend;

import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class HelloController {

    @GetMapping("/hello")
    public String hello() {
        return "Hello from Spring Boot!";
    }

        @GetMapping("/hello/1")
    public String hello1() {
        return "되니?되니?되니?되니?";
    }
}
