package com.example.backend.service;

import com.example.backend.dto.response.CategoryDetailResponse;
import com.example.backend.dto.response.CategorySimpleResponse;
import com.example.backend.mapper.CategoryMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {
    @Autowired
    private CategoryMapper categoryMapper;

    public List<CategorySimpleResponse> findAll() { return categoryMapper.findAll(); }
    public List<CategorySimpleResponse> findByRegion1Id(Long id) { return categoryMapper.findByRegion1Id(id); }
    public List<CategorySimpleResponse> findByRegion2Id(Long id) { return categoryMapper.findByRegion2Id(id); }
    public Optional<CategoryDetailResponse> findById(Long id) { return categoryMapper.findById(id); }
    @Transactional
    public void incrementViewCount(Long id) { categoryMapper.incrementViewCount(id); }
    public List<CategorySimpleResponse> searchByKeyword(String keyword) {
    return categoryMapper.searchByKeyword(keyword);
}

    public List<CategorySimpleResponse> searchByKeywordAndRegion1(String keyword, Long region1Id) {
    return categoryMapper.searchByKeywordAndRegion1(keyword, region1Id);
}

public List<CategorySimpleResponse> searchByKeywordAndRegion2(String keyword, Long region2Id) {
    return categoryMapper.searchByKeywordAndRegion2(keyword, region2Id);
}
}