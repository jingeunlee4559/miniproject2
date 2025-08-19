package com.example.backend;

import java.nio.charset.StandardCharsets;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.util.FileCopyUtils;

import com.example.backend.service.GeminiService;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	// AI 테스트 코드(삭제 예정)
    @Bean
    public CommandLineRunner run(GeminiService geminiService) {
        return args -> {
            // 외부 파일 시스템 경로에서 userPreferences.json 파일을 읽어옵니다.
            String userPreferencesJsonPath = "backend\\src\\main\\resources\\temporary\\userPreferences.json";
            FileSystemResource resource = new FileSystemResource(userPreferencesJsonPath);
            
            String userPreferencesJson;
            try {
                byte[] data = FileCopyUtils.copyToByteArray(resource.getInputStream());
                userPreferencesJson = new String(data, StandardCharsets.UTF_8);
            } catch (Exception e) {
                System.err.println("Error reading user preferences file: " + e.getMessage());
                return; // 파일 로드 실패 시 종료
            }

            // 읽어온 JSON 데이터를 GeminiService로 전달합니다.
            String geminiResponse = geminiService.callGemini(userPreferencesJson);
            System.out.println("Gemini Response: " + geminiResponse);
        };
    }
}
