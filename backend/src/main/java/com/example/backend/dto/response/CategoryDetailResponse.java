package com.example.backend.dto.response;

import java.sql.Clob;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CategoryDetailResponse {
    private Long id;
    private String name;
    private String shortDesc;
    private String detailDesc;
    private String address;
    private int viewCount;
    private List<String> imageUrls;
    private String region1Name;
    private String region2Name;
    private double lat;
    private double lon;
    private String fee;
    private String openingHours;
    private String holiday;
    private String parkingAvailable;
    
   // Oracle CLOB을 직접 받기 위한 필드 (JSON에는 노출되지 않음)
    @JsonIgnore
    private Object extraInfo; // CLOB을 받을 수 있도록 Object 유지
    
    // 실제 API 응답에 포함될 필드
    @JsonProperty("extraInfo")
    public Map<String, Object> getExtraInfoParsed() {
        return parseExtraInfo();
    }
    
    private Map<String, Object> parseExtraInfo() {
        if (extraInfo == null) {
            return null;
        }
        
        try {
            String jsonString = null;
            
            // Oracle CLOB 타입 처리
            if (extraInfo instanceof Clob) {
                Clob clob = (Clob) extraInfo;
                jsonString = clob.getSubString(1, (int) clob.length());
            } else if (extraInfo instanceof String) {
                jsonString = (String) extraInfo;
            } else {
                return null;
            }
            
            if (jsonString != null && !jsonString.trim().isEmpty()) {
                ObjectMapper mapper = new ObjectMapper();
                return mapper.readValue(jsonString, new TypeReference<Map<String, Object>>() {});
            }
            
        } catch (Exception e) {
            // 파싱 실패 시 로그만 남기고 null 반환
            System.err.println("ExtraInfo 파싱 실패: " + e.getMessage());
        }
        
        return null;
    }
}