package com.didichuxing.decision.controller;

import com.didichuxing.decision.service.SSOService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Created by didi on 2017/11/1.
 */
@Controller
public class LoginController {
    private static final Logger LOGGER = LoggerFactory.getLogger(LoginController.class);

    @Autowired
    private SSOService ssoService;

    private String mainIndex = "http://fe-test.intra.xiaojukeji.com/oceanus/index.html";

    @RequestMapping(value = "/oceanus", method = RequestMethod.GET)
    public String index(HttpServletRequest request, HttpServletResponse response) {
        boolean isLogin = ssoService.checkLogin(request, response);
        String redirect = mainIndex;
        if (isLogin == false) {
            String currentUrl = request.getRequestURL().toString();
            LOGGER.error("currentUrl = " + currentUrl);
            if (request.getQueryString() != null) {
                currentUrl += "?" + request.getQueryString();
                LOGGER.error("getQueryString != null, currentUrl = " + currentUrl);
            }
            String loginUrl = ssoService.loginRequired(currentUrl);
            redirect = "redirect:" + loginUrl;
            LOGGER.error("redirect loginUrl = " + loginUrl);
            return redirect;
        }
        System.out.println("user already login");
        return redirect;
    }
}
