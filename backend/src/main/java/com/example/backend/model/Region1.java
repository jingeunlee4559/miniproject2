package com.example.backend.model;

import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
public class Region1 {
    private Long id;
    private String name;
    private List<Region2> region2s;
}
