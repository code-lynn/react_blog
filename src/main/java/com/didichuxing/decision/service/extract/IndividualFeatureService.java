package com.didichuxing.decision.service.extract;

import com.alibaba.fastjson.JSONObject;
import com.didichuxing.decision.dao.CityDao;
import com.didichuxing.decision.dao.DatasrcDao;
import com.didichuxing.decision.dao.FeatureExtractTaskDao;
import com.didichuxing.decision.entity.City;
import com.didichuxing.decision.entity.FeatureExtractTask;
import com.didichuxing.decision.exception.ErrorCode;
import com.didichuxing.decision.tools.Const;
import com.didichuxing.decision.tools.ResponseValueTool;
import com.didichuxing.decision.tools.ServiceTool;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Created by didi on 2017/10/25.
 */
@Service
public class IndividualFeatureService {
    private static final Logger LOGGER = LoggerFactory.getLogger(IndividualFeatureService.class);

    @Autowired
    private FeatureExtractTaskDao featureExtractTaskDao;
    @Autowired
    private CityDao cityDao;
    @Autowired
    private DatasrcDao datasrcDao;

    public String selectTaskByApplierName(String applierName){
        List<FeatureExtractTask> resultSet = featureExtractTaskDao.selectTaskByApplierName(applierName);
        List<City> cities = cityDao.selectAll();

        int code;
        String message = Const.EMPTY_VALUE_STRING;

        if (resultSet.isEmpty() || cities.isEmpty()){
            code = ErrorCode.ERROR_EMPTY_RESULT.getCode();
            message = Const.ERROR_MSG_PREFIX + ErrorCode.ERROR_EMPTY_RESULT.getMessage() + "name: " + applierName;
        }
        else {
            code = ErrorCode.SUCCESS.getCode();
            message = ErrorCode.SUCCESS.getMessage();
        }

        List<String> cityNames = new ArrayList<>();
        List<FeatureExtractTask> updateResult = resultSet.stream()
            .map(task -> {
                List<String> cityIds = Arrays.asList(task.getCities().split(","));

                cities.stream()
                    .filter(city -> cityIds.contains(String.valueOf(city.getId())))
                    .forEach(city -> cityNames.add(city.getChineseName()));

                task.setCities(String.join(",", cityNames));
                cityNames.clear();
                return task;
        }).collect(Collectors.toList());

        return ResponseValueTool.buildResponseString(code, message, updateResult);
    }

    public String editIndividualTask(FeatureExtractTask extractTask){
        int code;
        String message = Const.EMPTY_VALUE_STRING;
        if (extractTask == null){
            code = ErrorCode.ERROR_NULL_REQUEST_PARAM.getCode();
            message = Const.ERROR_MSG_PREFIX + ErrorCode.ERROR_NULL_REQUEST_PARAM.getMessage();
            LOGGER.error(message);
        }
        else {
            List<String> tableAlias = Arrays.stream(extractTask.getFeatureList().split(","))
                .map(feature -> feature.split("\\.")[0])
                .distinct()
                .collect(Collectors.toList());

            JSONObject tableStatus = new JSONObject();
            Set<String> groups = new HashSet<>();
            datasrcDao.selectByAlias(tableAlias).stream()
                .forEach(datasrc -> {
                    groups.add(datasrc.getGroup());
                    tableStatus.put(datasrc.getHiveTable(), 1);
                });

            extractTask.setTableGroup(String.join(",", groups));
            extractTask.setTableStatus(tableStatus.toJSONString());

            int result = featureExtractTaskDao.editIndividualTask(extractTask);
            Object[] errorCode = ServiceTool.updateHelper(result, extractTask.getId());
            code = Integer.valueOf(errorCode[0].toString());
            message = errorCode[1].toString();
        }

        return ResponseValueTool.buildResponseString(code, message);
    }

    public String copyTask(long id, String startDay, String endDay){
        int result = featureExtractTaskDao.copyTask(id, startDay, endDay);
        Object[] errorCode = ServiceTool.updateHelper(result, id);
        return ResponseValueTool.buildResponseString(errorCode[0], errorCode[1]);
    }

    public String deleteIndividualTask(long id, int status){
        int result = featureExtractTaskDao.deleteIndividualTask(id, status);
        Object[] errorCode = ServiceTool.updateHelper(result, id);
        return ResponseValueTool.buildResponseString(errorCode[0], errorCode[1]);
    }

    public String selectById(long id){
        FeatureExtractTask task = featureExtractTaskDao.selectTaskById(id);
        int code;
        String message = Const.EMPTY_VALUE_STRING;
        if (task == null){
            code = ErrorCode.ERROR_NO_RECORD.getCode();
            message = Const.ERROR_MSG_PREFIX + ErrorCode.ERROR_NO_RECORD.getMessage() + "不存在记录id:" + id;
            LOGGER.error(message);
        }
        else {
            code = ErrorCode.SUCCESS.getCode();
            message = ErrorCode.SUCCESS.getMessage();
        }
        return ResponseValueTool.buildResponseString(code, message, task);
    }
}
