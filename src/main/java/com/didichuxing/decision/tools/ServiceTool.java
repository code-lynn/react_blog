package com.didichuxing.decision.tools;

import com.didichuxing.decision.exception.ErrorCode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Created by didi on 2017/10/26.
 */
public final class ServiceTool {
    private static final Logger LOGGER = LoggerFactory.getLogger(ServiceTool.class);

    public static Object[] updateHelper(int result, long id){
        int code;
        String message = Const.EMPTY_VALUE_STRING;
        if (result == 0){
            code = ErrorCode.ERROR_NO_RECORD.getCode();
            message = Const.ERROR_MSG_PREFIX + ErrorCode.ERROR_NO_RECORD.getMessage() + "。id: " + id;
            LOGGER.error(message);
        }
        else {
            code = ErrorCode.SUCCESS.getCode();
            message = ErrorCode.SUCCESS.getMessage();
        }

        return new Object[]{code, message};
    }
}
