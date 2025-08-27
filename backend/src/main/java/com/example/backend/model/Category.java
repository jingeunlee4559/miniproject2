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
    private String extraInfo;
    private Region2 region2;
    private double lat;
    private double lon;
    private String fee;
    private String openingHours;
    private String holiday;
    private String parkingAvailable;
}

    

