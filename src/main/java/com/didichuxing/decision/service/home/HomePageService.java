package com.didichuxing.decision.service.home;

import com.didichuxing.decision.exception.ErrorCode;
import com.didichuxing.decision.dao.UpdateRecordDao;
import com.didichuxing.decision.entity.UpdateRecord;
import com.didichuxing.decision.tools.Const;
import com.didichuxing.decision.tools.ResponseValueTool;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by didi on 2017/9/25.
 */
@Service
public class HomePageService {
    private static final Logger LOGGER = LoggerFactory.getLogger(HomePageService.class);

    @Autowired
    private UpdateRecordDao updateRecordDao;

    public String getTopKUpdateRecord(int size, int offset){
        List<UpdateRecord> resultSet = updateRecordDao.select(size, offset);
        int code;
        String message = Const.EMPTY_VALUE_STRING;
        if (resultSet.isEmpty()){
            code = ErrorCode.ERROR_EMPTY_RESULT.getCode();
            message = message + Const.ERROR_MSG_PREFIX + ErrorCode.ERROR_EMPTY_RESULT.getMessage();
        }
        else {
            code = ErrorCode.SUCCESS.getCode();
            message = ErrorCode.SUCCESS.getMessage();
        }

        return ResponseValueTool.buildResponseString(code, message, resultSet);
    }
}
