package com.didichuxing.decision.exception;

/**
 * Created by didi on 2017/10/25.
 */
public enum ErrorCode {

    SUCCESS(10000, "SUCCESS"),

    ERROR_EMPTY_RESULT(10001, "查询结果为空。"),
    ERROR_NULL_REQUEST_PARAM(1002, "请求参数为空。"),

    ERROR_START_DATE_GT_END_DATE(1100, "开始日期大于截止日期。"),
    ERROR_DATETIME_FORMAT(1101, "日期格式不合法。"),

    ERROR_NO_RECORD(20000, "不存在这条数据。"),
    ;

    private int code;
    private String message;

    ErrorCode(int code, String message) {
        this.code = code;
        this.message = message;
    }

    public int getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }
}
