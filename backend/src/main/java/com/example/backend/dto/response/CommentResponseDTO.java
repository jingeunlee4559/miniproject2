package com.example.backend.dto.response;

import java.time.LocalDateTime;

import com.example.backend.model.Comments;
import com.example.backend.model.Member;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CommentResponseDTO {
    private Long comment_seq;
    private String comment_content;
    private String mem_id;
    private String mem_name;
    private LocalDateTime created_at;
    private boolean isEditable;
    private boolean isDeletable;

    public static CommentResponseDTO of(Comments comment, String mem_name) {
        CommentResponseDTO dto = new CommentResponseDTO();
        dto.setComment_seq(comment.getComment_seq());
        dto.setComment_content(comment.getComment_content());
        dto.setMem_id(comment.getMem_id());
        dto.setMem_name(mem_name);
        dto.setCreated_at(comment.getCreated_at());
        return dto;
    }
}
