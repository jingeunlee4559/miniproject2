package com.example.backend.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.example.backend.dto.response.CategoryDetailResponse;
import com.example.backend.dto.response.CategorySimpleResponse;

import java.util.List;
import java.util.Optional;

@Mapper
public interface CategoryMapper {
    List<CategorySimpleResponse> findAll();
    List<CategorySimpleResponse> findByRegion1Id(@Param("region1Id") Long region1Id);
    List<CategorySimpleResponse> findByRegion2Id(@Param("region2Id") Long region2Id);
    Optional<CategoryDetailResponse> findById(@Param("id") Long id);
    int incrementViewCount(@Param("id") Long id);

    List<CategorySimpleResponse> searchByKeyword(@Param("keyword") String keyword);
    List<CategorySimpleResponse> searchByKeywordAndRegion1(
        @Param("keyword") String keyword, 
        @Param("region1Id") Long region1Id
    );
    List<CategorySimpleResponse> searchByKeywordAndRegion2(
        @Param("keyword") String keyword, 
        @Param("region2Id") Long region2Id
    );
}
