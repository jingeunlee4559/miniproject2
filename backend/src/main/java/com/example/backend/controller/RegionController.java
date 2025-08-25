package com.example.backend.controller;

import com.example.backend.model.Region1;
import com.example.backend.service.RegionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000") 
@RequestMapping("/api/region")
public class RegionController {
    @Autowired private RegionService regionService;

    @GetMapping
    public List<Region1> getAllRegions() {
        return regionService.findAll();
    }
}
