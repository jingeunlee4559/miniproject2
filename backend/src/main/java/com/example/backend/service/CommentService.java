package com.example.backend.service;

import com.example.backend.Security.CustomUserDetails;
import com.example.backend.dto.request.Comment.*;
import com.example.backend.dto.response.CommentResponseDTO;
import com.example.backend.dto.response.MemberInfoResponseDTO;
import com.example.backend.mapper.CommentMapper;
import com.example.backend.mapper.MemberMapper;
import com.example.backend.model.Comments;
import com.example.backend.model.Member;
import com.example.backend.model.MemberRole;
import com.example.backend.model.TargetType;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
public class CommentService {

    @Autowired
    private CommentMapper commentMapper;

    @Autowired
    private MemberMapper memberMapper;

    public CommentResponseDTO createComment(TargetType targetType, Long targetSeq, CustomUserDetails currentUser,
            CommentCreateRequestDTO requestDto) {

        Comments comment = new Comments(requestDto);
        comment.setMem_id(currentUser.getUsername());
        comment.setTarget_type(targetType);
        comment.setTarget_seq(targetSeq);

        commentMapper.createComment(comment);
        comment = commentMapper.findBySeq(comment.getComment_seq());
        return CommentResponseDTO.of(comment, currentUser.getMember().getMem_name());
    }

    public List<CommentResponseDTO> getCommentsByTargetSeq(TargetType targetType, Long targetSeq,
            CustomUserDetails currentUser) {
        // 1. 특정 게시글의 모든 댓글을 DB에서 가져옵니다. (1번 쿼리)
        List<Comments> comments = commentMapper.findByTargetSeq(targetType, targetSeq);

        if (comments.isEmpty()) {
            return new ArrayList<>(); // 댓글이 없으면 빈 리스트 반환
        }

        // 2. 댓글 목록에서 작성자 ID들을 중복 없이 추출합니다.
        Set<String> memberIdSet = new HashSet<>();
        for (Comments comment : comments) {
            memberIdSet.add(comment.getMem_id());
        }

        // 3. 추출된 ID 목록으로 모든 작성자 정보를 DB에서 한번에 가져옵니다. (2번 쿼리)
        List<String> memberIds = new ArrayList<>(memberIdSet);
        List<Member> members = memberMapper.findByIds(memberIds);

        // 4. 빠른 조회를 위해 작성자 정보를 Map 형태로 변환합니다. (Key: mem_id, Value: Member 객체)
        Map<String, Member> membersMap = new HashMap<>();
        for (Member member : members) {
            membersMap.put(member.getMem_id(), member);
        }

        // 5. 최종적으로 반환할 DTO 리스트를 생성합니다.
        List<CommentResponseDTO> responseDtos = new ArrayList<>();
        for (Comments comment : comments) {
            // 5-1. Map에서 댓글 작성자 정보를 찾습니다. (DB 조회 X)
            Member member = membersMap.get(comment.getMem_id());

            // 5-2. 댓글과 작성자 정보를 사용해 DTO를 생성합니다.
            CommentResponseDTO dto = CommentResponseDTO.of(comment, member.getMem_name());

            // 5-3. 권한을 계산하여 DTO에 설정합니다.
            boolean isEditable = false;
            boolean isDeletable = false;
            if (currentUser != null) {
                if (comment.getMem_id().equals(currentUser.getUsername())) {
                    isEditable = true;
                    isDeletable = true;
                }
                if (currentUser.getMember().getMem_role() == MemberRole.ADMIN) {
                    isDeletable = true;
                }
            }
            dto.setEditable(isEditable);
            dto.setDeletable(isDeletable);

            // 5-4. 완성된 DTO를 최종 리스트에 추가합니다.
            responseDtos.add(dto);
        }

        // 6. DTO 리스트를 반환합니다.
        return responseDtos;
    }

    public void updateComment(String currentUserId, Long commentSeq, CommentUpdateRequestDTO requestDto) {
        Comments comment = commentMapper.findBySeq(commentSeq);
        if (comment == null) {
            throw new RuntimeException("수정할 댓글이 존재하지 않습니다.");
        }

        if (!comment.getMem_id().equals(currentUserId)) {
            throw new AccessDeniedException("댓글을 수정할 권한이 없습니다.");
        }

        comment.setComment_content(requestDto.getComment_content());
        commentMapper.updateComment(comment);
    }

    public void deleteComment(String currentUserId, Long commentId) {
        Comments comment = commentMapper.findBySeq(commentId);
        if (comment == null) {
            return; // 이미 삭제되었거나 없는 경우, 그냥 성공으로 처리
        }

        Member currentUser = memberMapper.findById(currentUserId);
        boolean isOwner = comment.getMem_id().equals(currentUserId);
        boolean isAdmin = (currentUser != null && currentUser.getMem_role() == MemberRole.ADMIN);

        if (!isOwner && !isAdmin) {
            throw new AccessDeniedException("댓글을 삭제할 권한이 없습니다.");
        }

        commentMapper.deleteComment(commentId);
    }
}