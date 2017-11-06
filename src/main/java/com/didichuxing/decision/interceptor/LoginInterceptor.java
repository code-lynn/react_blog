package com.didichuxing.decision.interceptor;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.didichuxing.decision.service.SSOService;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Created by didi on 2017/10/31.
 */
public class LoginInterceptor extends HandlerInterceptorAdapter{

    private static final Logger LOGGER = LoggerFactory.getLogger(LoginInterceptor.class);

    @Autowired
    private SSOService ssoService;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String currentUrl = request.getRequestURI();
        if (currentUrl.equals("/oceanus/login/callback")){
            return true;
        }

        String ticket = ssoService.getTicketFromCookie(request, response);
        String username = ssoService.getUsernameFromCookie(request, response);

        if (ticket == null || StringUtils.isEmpty(ticket)){
            String loginUrl = ssoService.loginRequired(currentUrl);
            response.sendRedirect(loginUrl);
            return false;
        }
        else {
            return ssoService.validTicket(ticket);
        }



//        JSONObject params = new JSONObject();
//        params.put("ticket", ticket);
//        params.put("app_id", ssoService.getJetAppId());
//
//        String checkTicketUrl = ssoService.getTicketUrl();
//        RestTemplate restTemplate = new RestTemplateBuilder().build();
//        HttpHeaders headers = new HttpHeaders();
//        headers.add("Content-type", "application/x-www-form-urlencoded");
//        headers.add("Accept", "application/json");
//
//        LOGGER.error("params ========> " + params.toString());
//        LOGGER.error("currentUrl =========> " + currentUrl);
//        LOGGER.error("checkTicketUrl =========> " + checkTicketUrl);
//        String result = restTemplate.postForEntity(checkTicketUrl,
//            new HttpEntity<>(params.toString(), headers),
//            String.class).getBody();
//
//        LOGGER.error("checkTicketUrl result =======>" + result);
//        JSONObject resultInfo = JSON.parseObject(result);
//
//        if (resultInfo.getIntValue("errno") == 1){
//            String loginUrl = ssoService.loginRequired(currentUrl);
//            LOGGER.error("loginUrl ========> " + loginUrl);
//            response.sendRedirect(loginUrl);
//            return false;
//        }
//        else {
//            return true;
//        }
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
        super.postHandle(request, response, handler, modelAndView);
    }
}
