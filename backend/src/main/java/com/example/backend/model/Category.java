package com.example.backend.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Category {
    private Long id;
    private String name;
    private String shortDesc;
    private String detailDesc;
    private String address;
    private int viewCount;
    private String imageUrl;
    // ... travel_spot 테이블의 나머지 모든 필드 추가 (lat, lon, fee 등)
    private Region2 region2;
}

    

