package com.example.backend.service;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.backend.Security.CustomUserDetails;
import com.example.backend.dto.request.Board.*;
import com.example.backend.dto.response.*;
import com.example.backend.mapper.BoardMapper;
import com.example.backend.model.Board;
import com.example.backend.model.Member;
import com.example.backend.model.MemberRole;

@Service
public class BoardService {
    @Autowired
    private BoardMapper boardMapper;

    @Value("${file.upload-dir}")
    private String uploadDir;

    public void createBoard(BoardCreateRequestDTO requestDTO, MultipartFile board_img, String mem_id)
            throws IOException {

        Board board = new Board(requestDTO);
        board.setMem_id(mem_id);

        if (board_img != null) {
            // 이미지 저장 처리

            // 새 파일 저장
            String originalFileName = board_img.getOriginalFilename();
            String extension = originalFileName.substring(originalFileName.lastIndexOf("."));
            String storedFileName = UUID.randomUUID().toString() + extension;
            File destFile = new File(uploadDir + storedFileName);
            board_img.transferTo(destFile);

            // Board 객체에 새 파일 정보 설정
            board.setOriginal_fileName(originalFileName);
            board.setStored_fileName(storedFileName);
        }

        boardMapper.createBoard(board);
    }

    public void updateBoard(Long boardSeq, BoardUpdateRequestDTO requestDTO, MultipartFile board_img)
            throws IOException {

        Board board = boardMapper.findBoardBySeq(boardSeq);
        if (board == null) {
            throw new RuntimeException("없는 게시글");
        }

        if (requestDTO.getBoard_title() != null) {
            board.setBoard_title(requestDTO.getBoard_title());
        }
        if (requestDTO.getBoard_content() != null) {
            board.setBoard_content(requestDTO.getBoard_content());
        }

        if (board_img != null) {

            // 새 파일 저장
            String originalFileName = board_img.getOriginalFilename();
            String extension = originalFileName.substring(originalFileName.lastIndexOf("."));
            String storedFileName = UUID.randomUUID().toString() + extension;
            File destFile = new File(uploadDir + storedFileName);
            board_img.transferTo(destFile);

            // Board 객체에 새 파일 정보 설정
            board.setOriginal_fileName(originalFileName);
            board.setStored_fileName(storedFileName);
        }

        boardMapper.updateBoard(board);
    }

    public void deleteBoard(Long boardSeq) {
        boardMapper.deleteBoard(boardSeq);
    }

    public BoardDetailResponseDTO getBoard(Long boardSeq, CustomUserDetails currentUser) {
        boardMapper.incrementViewCount(boardSeq);
        
        Board board = boardMapper.findBoardBySeq(boardSeq);
        BoardDetailResponseDTO responseDTO = BoardDetailResponseDTO.from(board);

        if (currentUser == null) {
            responseDTO.setEditable(false);
            responseDTO.setDeletable(false);
            return responseDTO;
        }
        
        PermissionResult result = getCheckPermissions(board, currentUser.getMember());

        responseDTO.setEditable(result.isEditable);
        responseDTO.setDeletable(result.isDeletable);

        return responseDTO;
    }

    public List<BoardListResponseDTO> getAllBoards() {
        List<BoardListResponseDTO> boardList = new ArrayList<>();
        for (var board : boardMapper.getAllBoards()) {
            boardList.add(BoardListResponseDTO.from(board));
        }
        return boardList;
    }


    //#region 게시글 권한 확인
    public record PermissionResult(boolean isEditable, boolean isDeletable) {
    }

    // 작성자 본인 확인 메서드
    private PermissionResult checkPermission(Board board, Member loginMember) {

        boolean isOwner = false;
        boolean isAdmin = false;

        if (loginMember != null) {
            // 작성자 본인 확인
            if (board.getMem_id().equals(loginMember.getMem_id())) {
                isOwner = true;
            }

            // 로그인멤버 권한 확인
            if (loginMember.getMem_role() == MemberRole.ADMIN) {
                isAdmin = true;
            }
        }

        boolean isEditable = isOwner;
        boolean isDeletable = isAdmin || isOwner;

        return new PermissionResult(isEditable, isDeletable);
    }

    public PermissionResult getCheckPermissions(Board board, Member loginMember) {
        return checkPermission(board, loginMember);
    }

    public boolean isEditable(Long boardSeq, Member loginMember) {
        Board board = boardMapper.findBoardBySeq(boardSeq);
        if (board == null) {
            throw new RuntimeException("게시글을 찾을수 없습니다");
        }
        return checkPermission(board, loginMember).isEditable;
    }

    public boolean isDeletable(Long boardSeq, Member loginMember) {
        Board board = boardMapper.findBoardBySeq(boardSeq);
        if (board == null) {
            throw new RuntimeException("게시글을 찾을수 없습니다");
        }
        return checkPermission(board, loginMember).isDeletable;
    }
    //#endregion
}
