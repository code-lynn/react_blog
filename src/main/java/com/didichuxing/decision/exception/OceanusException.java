package com.didichuxing.decision.exception;

/**
 * Created by didi on 2017/10/26.
 */
public class OceanusException extends Exception {

    private ErrorCode errorCode;
    private String operator;

    public ErrorCode getErrorCode() {
        return errorCode;
    }

    public void setErrorCode(ErrorCode errorCode) {
        this.errorCode = errorCode;
    }

    public String getOperator() {
        return operator;
    }

    public void setOperator(String operator) {
        this.operator = operator;
    }

    public String getExceptionMsg(){
        return operator + ": " + errorCode.getMessage();
    }

    @Override
    public String toString() {
        return super.toString();
    }
}
