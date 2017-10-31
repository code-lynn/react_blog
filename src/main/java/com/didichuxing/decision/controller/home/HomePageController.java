package com.didichuxing.decision.controller.home;

import com.didichuxing.decision.entity.UpdateRecord;
import com.didichuxing.decision.exception.ErrorCode;
import com.didichuxing.decision.service.SSOService;
import com.didichuxing.decision.service.home.HomePageService;
import com.didichuxing.decision.tools.Const;
import com.didichuxing.decision.tools.ResponseValueTool;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.List;

/**
 * Created by didi on 2017/9/25.
 */
@RestController
@RequestMapping("/")
public class HomePageController {
    private static final Logger LOGGER = LoggerFactory.getLogger(HomePageController.class);

    @Autowired
    private HomePageService homePageService;

    @Autowired
    private SSOService ssoService;

    @RequestMapping(value = "home/update_record", method = RequestMethod.GET, produces = "application/json;charset=UTF-8")
    public String updateRecords(@RequestParam(value = "size", defaultValue = "5") int size,
                                            @RequestParam(value = "offset", defaultValue = "0") int offset){
        return homePageService.getTopKUpdateRecord(size, offset);
    }

    @RequestMapping(value = "index", method = RequestMethod.GET)
    public String index(HttpServletRequest request, HttpServletResponse response) {
        boolean isLogin = ssoService.checkLogin(request, response);
        String redirect = null;
        if (isLogin == false) {
            String currentUrl = request.getRequestURL().toString();
            if (request.getQueryString() != null) {
                currentUrl += "?" + request.getQueryString();
            }
            String loginUrl = ssoService.loginRequired(currentUrl);
            redirect = "redirect:" + loginUrl;
            return redirect;
        }
        System.out.println("user already login");
        return redirect;
    }
}
