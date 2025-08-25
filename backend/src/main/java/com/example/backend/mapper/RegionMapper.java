package com.example.backend.mapper;

import com.example.backend.model.Region1;
import org.apache.ibatis.annotations.Mapper;
import java.util.List;

@Mapper
public interface RegionMapper {
    List<Region1> findAllRegions();
}
