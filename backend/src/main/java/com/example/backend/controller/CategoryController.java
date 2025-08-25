package com.example.backend.controller;

import com.example.backend.dto.response.CategoryDetailResponse;
import com.example.backend.dto.response.CategorySimpleResponse;
import com.example.backend.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
    
@RestController
@CrossOrigin(origins = "http://localhost:3000") 
@RequestMapping("/api/category")
public class CategoryController {
   
    @Autowired
    private CategoryService categoryService;

    @GetMapping("/all")
    public List<CategorySimpleResponse> getTravelSpots(
            @RequestParam(value = "region1Id", required = false) Long region1Id,
            @RequestParam(value = "region2Id", required = false) Long region2Id) {

        if (region2Id != null) {
            return categoryService.findByRegion2Id(region2Id);
        }
        if (region1Id != null) {
            return categoryService.findByRegion1Id(region1Id);
        }
        return categoryService.findAll();
    }

    @GetMapping("/search")
    public List<CategorySimpleResponse> searchTravelSpots(
            @RequestParam(value = "keyword", required = false) String keyword,
            @RequestParam(value = "region1Id", required = false) Long region1Id,
            @RequestParam(value = "region2Id", required = false) Long region2Id) {
        
        // keyword가 null이거나 빈 문자열인 경우 일반 조회로 처리
        if (keyword == null || keyword.trim().isEmpty()) {
            if (region2Id != null) {
                return categoryService.findByRegion2Id(region2Id);
            }
            if (region1Id != null) {
                return categoryService.findByRegion1Id(region1Id);
            }
            return categoryService.findAll();
        }
        
        // 검색어가 있는 경우에만 검색 실행
        if (region2Id != null) {
            return categoryService.searchByKeywordAndRegion2(keyword.trim(), region2Id);
        }
        if (region1Id != null) {
            return categoryService.searchByKeywordAndRegion1(keyword.trim(), region1Id);
        }
        return categoryService.searchByKeyword(keyword.trim());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoryDetailResponse> getTravelSpotById(@PathVariable Long id) {
        return categoryService.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/view")
    public ResponseEntity<Void> incrementViewCount(@PathVariable Long id) {
        categoryService.incrementViewCount(id);
        return ResponseEntity.ok().build();
    }
}