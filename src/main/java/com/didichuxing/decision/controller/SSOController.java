package com.didichuxing.decision.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.didichuxing.decision.service.SSOService;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.util.WebUtils;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Created by didi on 2017/1/4.
 */
@Controller
@RequestMapping("/")
public class SSOController {

    private static Logger logger = LoggerFactory.getLogger(SSOController.class);

    @Autowired
    private SSOService ssoService;

    @Value("${main.index}")
    private String        mainIndex;

    @RequestMapping(value = "callback", method = RequestMethod.GET)
    public String callback(HttpServletRequest request, HttpServletResponse response) {
        boolean result = false;
        String redirect = null;

        try {
            result = checkCode(request, response);
        } catch (IOException e) {
            logger.error("IOException", e);
        } catch (ServletException e) {
            logger.error("ServletException", e);
        }
        if (result) {
            String jumpto = null;
            jumpto = WebUtils.findParameterValue(request, "jumpto");
            if (jumpto != null) {
                redirect = "redirect:" + jumpto;
            } else {
                redirect = "redirect:" + mainIndex;
            }
        } else {
            logger.error("code error ");
        }
        return redirect;
    }

    @RequestMapping(value = "login", method = RequestMethod.GET)
    public String login(HttpServletRequest request, HttpServletResponse response) {
        String ticket = ssoService.getTicketFromCookie(request, response);
        String redirect = null;
        if (StringUtils.isEmpty(ticket)) {
            String currentUrl = request.getRequestURL().toString();
            if (request.getQueryString() != null) {
                currentUrl += "?" + request.getQueryString();
            }
            String loginUrl = ssoService.loginRequired(currentUrl);
            redirect = "redirect:" + loginUrl;
        } else {
            redirect = "redirect:" + mainIndex;
        }
        return redirect;
    }

    @RequestMapping(value = "logout", method = RequestMethod.GET)
    public String logout(HttpServletRequest request, HttpServletResponse response) {
        ssoService.clearCookies(request, response);
        String logoutUrl = ssoService.getLogoutUrl();
        return "redirect:" + logoutUrl;
    }

    private boolean checkCode(HttpServletRequest request, HttpServletResponse response) throws IOException,
                                                                                        ServletException {
        String code = WebUtils.findParameterValue(request, "code");
        if (StringUtils.isNotEmpty(code)) {
            String result = ssoService.validCode(code);
            JSONObject rootObject = JSON.parseObject(result);
            Integer error = rootObject.getInteger("errno");
            if (error != null) {
                JSONObject dataObject = rootObject.getJSONObject("data");
                if (dataObject != null) {
                    String ticket = dataObject.getString("ticket");
                    String userName = dataObject.getString("username");
                    if (StringUtils.isEmpty(ticket) || StringUtils.isEmpty(userName)) {
                        logger.error("ticket or username empty");
                        return false;
                    }
                    ssoService.setUserCookie(request, response, ticket, userName);
                    return true;
                }
            }
        } else {
            logger.error("code empty");
        }
        return false;
    }

}
