package com.example.backend.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Region2 {
    private Long id;
    private String name;
    private Region1 region1;
}
