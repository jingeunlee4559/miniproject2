package com.example.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    // 1. 생성자 주입을 위해 final로 선언
    private final String uploadDir;

    // 2. 생성자에서 @Value를 통해 프로퍼티 값 주입
    public WebConfig(@Value("${file.upload-dir}") String uploadDir) {
        this.uploadDir = uploadDir;
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // 3. 중복된 CORS 설정을 하나로 통합
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:3000") // React 개발 서버 주소
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS") // 명시적으로 필요한 메소드만 허용
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 4. 플랫폼에 독립적인 방식으로 리소스 경로 설정
        String resourcePath = Paths.get(uploadDir).toUri().toString();
        registry.addResourceHandler("/images/**") // /images/ URL 패턴
                .addResourceLocations(resourcePath); // 실제 파일이 있는 로컬 경로
    }
}