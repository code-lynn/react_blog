package com.didichuxing.decision.dao;

import com.didichuxing.decision.entity.FeatureExtractTask;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * Created by didi on 2017/9/25.
 */
public interface FeatureExtractTaskDao {

    List<FeatureExtractTask> selectTaskByApplierName(@Param("applierName") String applierName);

    FeatureExtractTask selectTaskById(@Param("id") long id);

    int editIndividualTask(@Param("task") FeatureExtractTask task);

    int copyTask(@Param("id") long id, @Param("startDay") String startDay, @Param("endDay") String endDay);

    int deleteIndividualTask(@Param("id") long id, @Param("status") int status);
}
