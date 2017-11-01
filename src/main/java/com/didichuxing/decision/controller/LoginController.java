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

    @RequestMapping(value = "/", method = RequestMethod.GET)
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
