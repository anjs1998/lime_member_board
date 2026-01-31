package com.example.project.board.model.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.session.RowBounds;

import com.example.project.board.model.dto.Write;

@Mapper
public interface BoardMapper {

	public int getListCount();

	public List<Write> selectWriteList(RowBounds rowBounds);
	
	
    /**게시글 불러오기 */
	public Write selectWriteById(int writeId);
	
    /** 게시글 등록 */
    int insertWrite(Write write);
	
    /** 게시글 수정 */
    int updateWrite(Write write);

    /** 게시글 소프트 삭제 (DELETED_AT 업데이트) */
    int deleteWrite(Long postId);


}
