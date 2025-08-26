package com.example.backend.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.example.backend.model.Comments;
import com.example.backend.model.TargetType;

@Mapper
public interface CommentMapper {
    void createComment(Comments comment);

    void updateComment(Comments comment);
    
    void deleteComment(Long comment_seq);

    Comments findBySeq(Long comment_seq);

    List<Comments> findByTargetSeq(TargetType target_type, Long target_seq);
}
