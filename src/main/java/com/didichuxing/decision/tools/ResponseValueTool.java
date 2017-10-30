package com.didichuxing.decision.tools;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.serializer.SerializerFeature;
import com.didichuxing.decision.exception.ErrorCode;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by didi on 2017/10/24.
 */
public class ResponseValueTool {

    public static String buildResponseString(ErrorCode code, String message){
        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put(Const.RESPONSE_FIELD_STATUS, code.getCode());
        resultMap.put(Const.RESPONSE_FIELD_MSG, message);

        return JSON.toJSONString(resultMap, SerializerFeature.DisableCircularReferenceDetect);
    }

    public static String buildResponseString(Object code, Object message){
        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put(Const.RESPONSE_FIELD_STATUS, code);
        resultMap.put(Const.RESPONSE_FIELD_MSG, message);

        return JSON.toJSONString(resultMap, SerializerFeature.DisableCircularReferenceDetect);
    }

    public static String buildResponseString(int code, Object message, Object value){
        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put(Const.RESPONSE_FIELD_STATUS, code);
        resultMap.put(Const.RESPONSE_FIELD_MSG, message);
        resultMap.put(Const.RESPONSE_FIELD_VALUE, value);

        return JSON.toJSONString(resultMap, SerializerFeature.DisableCircularReferenceDetect);
    }

//    public static void main(String[] args){
//        Map<String, Object> value = new HashMap<>();
//        value.put("record", "test");
//        System.out.println(ResponseValueTool.buildResponseString(ErrorCode.SUCCESS, "", value));
//    }
}
