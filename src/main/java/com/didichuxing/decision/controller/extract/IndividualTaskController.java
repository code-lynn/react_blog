package com.didichuxing.decision.controller.extract;

import com.didichuxing.decision.entity.FeatureExtractTask;
import com.didichuxing.decision.exception.ErrorCode;
import com.didichuxing.decision.exception.OceanusException;
import com.didichuxing.decision.service.extract.IndividualFeatureService;
import com.didichuxing.decision.tools.Const;
import com.didichuxing.decision.tools.ResponseValueTool;
import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * Created by didi on 2017/10/25.
 */
@RestController
@RequestMapping("/extract_individual")
public class IndividualTaskController {
    private static final Logger LOGGER = LoggerFactory.getLogger(IndividualTaskController.class);
    private static final DateTimeFormatter FORMAT = DateTimeFormat.forPattern(Const.HYPHEN_FORMATTER);

    @Autowired
    private IndividualFeatureService individualFeatureService;

    @RequestMapping(value = "/all_task", method = RequestMethod.GET, produces = "application/json;charset=UTF-8")
    public String getTaskByApplierName(@RequestParam("applierName") String applierName){
        return individualFeatureService.selectTaskByApplierName(applierName);
    }

    @RequestMapping(value = "/edit", method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
    public String editIndividualTask(@RequestBody FeatureExtractTask task){
        return individualFeatureService.editIndividualTask(task);
    }

    @RequestMapping(value = "/copy", method = RequestMethod.GET, produces = "application/json;charset=UTF-8")
    public String copyTask(@RequestParam("id") long id,
                           @RequestParam("startDay") String startDay,
                           @RequestParam("endDay") String endDay)throws OceanusException{

        String responseString = Const.EMPTY_VALUE_STRING;
        String message = " startDay: " + startDay + ",endDay: " + endDay;

        try {
            if (FORMAT.parseMillis(startDay) > FORMAT.parseMillis(endDay)){
                message = Const.ERROR_MSG_PREFIX + ErrorCode.ERROR_START_DATE_GT_END_DATE.getMessage() + message;
                LOGGER.error(message);

                responseString = ResponseValueTool.buildResponseString(ErrorCode.ERROR_START_DATE_GT_END_DATE.getCode(), message);
            }
            else {
                responseString = individualFeatureService.copyTask(id, startDay, endDay);
            }
        }
        catch (Exception e){
            message = Const.ERROR_MSG_PREFIX + ErrorCode.ERROR_DATETIME_FORMAT.getMessage() + message;
            responseString = ResponseValueTool.buildResponseString(ErrorCode.ERROR_DATETIME_FORMAT.getCode(), message);
            LOGGER.error(message, e);
        }

        return responseString;
    }

    @RequestMapping(value = "/delete", method = RequestMethod.GET, produces = "application/json;charset=UTF-8")
    public String deleteIndividualTask(@RequestParam("id") long id,
                                       @RequestParam("status") int status){
        return individualFeatureService.deleteIndividualTask(id, status);
    }

    @RequestMapping(value = "/task", method = RequestMethod.GET, produces = "application/json;charset=UTF-8")
    public String selectById(@RequestParam("id") long id){
        return individualFeatureService.selectById(id);
    }
}
