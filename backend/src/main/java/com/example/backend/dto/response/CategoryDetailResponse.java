package com.example.backend.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CategoryDetailResponse {
    private Long id;
    private String name;
    private String shortDesc;
    private String detailDesc; // 상세 설명
    private String address;    // 주소
    private String fee;        // 입장료
    private String openingHours; // 이용 시간
    private String holiday;      // 휴일
    private String parkingAvailable; // 주차 가능 여부
    private int viewCount;
    private String imageUrl;
    private String region1Name;
    private String region2Name;
    private double lat; // 위도
    private double lon; // 경도
    // ... DB에 있는 다른 상세 정보 필드들도 여기에 추가 ...
}