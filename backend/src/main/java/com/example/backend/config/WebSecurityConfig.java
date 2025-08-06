package com.example.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable() // CSRF 비활성화 (React 사용 시)
            .formLogin().disable() // 기본 로그인 폼 비활성화
            .httpBasic().disable() // Basic Auth 비활성화
            .authorizeHttpRequests()
            .requestMatchers("/members/**").permitAll() // 회원가입, 로그인 API 허용
            .anyRequest().permitAll(); // 나머지도 허용 (초기 개발용)
        return http.build();
    }
}
