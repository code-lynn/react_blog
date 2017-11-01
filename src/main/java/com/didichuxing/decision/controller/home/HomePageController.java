package com.didichuxing.decision.controller.home;

import com.didichuxing.decision.service.home.HomePageService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created by didi on 2017/9/25.
 */
@RestController
@RequestMapping("/")
public class HomePageController {
    private static final Logger LOGGER = LoggerFactory.getLogger(HomePageController.class);

    @Autowired
    private HomePageService homePageService;

    @RequestMapping(value = "home/update_record", method = RequestMethod.GET, produces = "application/json;charset=UTF-8")
    public String updateRecords(@RequestParam(value = "size", defaultValue = "5") int size,
                                            @RequestParam(value = "offset", defaultValue = "0") int offset){
        return homePageService.getTopKUpdateRecord(size, offset);
    }

}
