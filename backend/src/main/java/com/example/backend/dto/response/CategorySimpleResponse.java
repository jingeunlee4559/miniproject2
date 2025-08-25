package com.example.backend.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CategorySimpleResponse {
    private Long id;
    private String name;
    private String shortDesc;
    private String imageUrl;
    private int viewCount;
}

