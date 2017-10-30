package com.didichuxing.decision.dao;

import com.didichuxing.decision.entity.UpdateRecord;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * Created by didi on 2017/9/25.
 */
public interface UpdateRecordDao {
    List<UpdateRecord> select(@Param("size") int size, @Param("offset") int offset);
}
