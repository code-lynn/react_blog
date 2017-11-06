package com.didichuxing.decision.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.didichuxing.decision.service.SSOService;
import com.didichuxing.decision.tools.Const;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.WebUtils;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Created by didi on 2017/11/1.
 */
@Controller
public class LoginController {
    private static final Logger LOGGER = LoggerFactory.getLogger(LoginController.class);

    @Autowired
    private SSOService ssoService;

    private String mainIndex = "http://fe-test.intra.xiaojukeji.com/oceanus/pages/index.html";

    @RequestMapping(value = "/oceanus/", method = RequestMethod.GET)
    public String index(Model model){
        return "redirect:" + mainIndex;
    }

//    @RequestMapping(value = "/login/callback", method = RequestMethod.GET)
//    public String loginCallback(Model model){
//        return "redirect:/oceanus/login/callback";
//    }

    @RequestMapping(value = "/oceanus/login/callback", method = RequestMethod.GET)
    public String login(HttpServletRequest request, HttpServletResponse response) {

        boolean result = false;
        String redirect = null;

        try {
            result = checkCode(request, response);
        } catch (IOException e) {
            LOGGER.error("IOException", e);
        } catch (ServletException e) {
            LOGGER.error("ServletException", e);
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
            LOGGER.error("code error ");
        }
        return redirect;

//        System.out.println("------------------> /login/callback");
//        String currentUrl = request.getRequestURI();
//        String checkCodeUrl = ssoService.getCallbackUrl();
//        RestTemplate restTemplate = new RestTemplateBuilder().build();
//        HttpHeaders headers = new HttpHeaders();
//        headers.add("Content-type", "application/x-www-form-urlencoded");
//        headers.add("Accept", "application/json");
//        JSONObject params = new JSONObject();
//        params.put("code", code);
//        params.put("app_id", ssoService.getJetAppId());
//        params.put("app_key", ssoService.getAppKey());
//
//        LOGGER.error("params ========> " + params.toString());
//
//        LOGGER.error("checkCodeUrl =========> " + checkCodeUrl);
//        String result = restTemplate.postForEntity(checkCodeUrl,
//            new HttpEntity<>(params.toString(), headers),
//            String.class).getBody();
//
//        LOGGER.error("result =========> " + result);
//        JSONObject loginInfo = JSON.parseObject(result);
//        if (loginInfo.getIntValue("errno") == 0){
//            String ticket = loginInfo.getJSONObject("data").getString("ticket");
//            String username = loginInfo.getJSONObject("data").getString("username");
//            LOGGER.error("ticke={}, username={}", ticket, username);
//            ssoService.setUserCookie(request, response, ticket, username);
//
////            return "redirect:" + Const.MAIN_INDEX;
//            if(StringUtils.isBlank(jumpto) || jumpto.equals("index")){
//                return "redirect:" + Const.MAIN_INDEX;
//            }else{
//                return "redirect:" + jumpto;
//            }
//        }
//        else {
//            String loginUrl = ssoService.loginRequired(currentUrl);
//            return "redirect: " + loginUrl;
//        }
    }

    @RequestMapping(value = "/oceanus/logout", method = RequestMethod.GET)
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
                        LOGGER.error("ticket or username empty");
                        return false;
                    }
                    ssoService.setUserCookie(request, response, ticket, userName);
                    return true;
                }
            }
        } else {
            LOGGER.error("code empty");
        }
        return false;
    }
}
