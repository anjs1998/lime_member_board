package com.example.project.board.model.dto;

import java.util.Date;

import org.springframework.web.multipart.MultipartFile;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WriteFile{
    private int fileId;                // FILE_ID
    private long postId;                // POST_ID
    private String path;              // PATH (저장 경로)
    private String fileNameOriginal;  // FILE_NAME_ORIGINAL (원본 파일명)
    private String fileNameSaved;     // FILE_NAME_SAVED (서버 저장 파일명)
    private Date dateSaved;           // DATE_SAVED (저장 날짜)
    
    private MultipartFile uploadFile;
}
