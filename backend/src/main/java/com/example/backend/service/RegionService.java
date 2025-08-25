package com.example.backend.service;

import com.example.backend.mapper.RegionMapper;
import com.example.backend.model.Region1;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class RegionService {
    @Autowired private RegionMapper regionMapper;
    public List<Region1> findAll() { return regionMapper.findAllRegions(); }
}
