package com.didichuxing.decision.service;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.didichuxing.decision.tools.http.HttpClientUtils;
import com.google.common.collect.Maps;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Service;
import org.springframework.web.util.WebUtils;

import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.Map;

@Service
@PropertySource("classpath:config.properties")
public class SSOService {

    private static Logger logger = LoggerFactory.getLogger(SSOService.class);

    @Value("${sso.auth.appid}")
    private String jetAppId;

    @Value("${sso.auth.appkey}")
    private String appKey;

    @Value("${auth.host}sso/login?app_id=${sso.auth.appid}&version=1.0")
    private String loginUrl;

    @Value("${auth.host}ldap/logout?app_id=${sso.auth.appid}&version=1.0")
    private String logoutUrl;

    @Value("${auth.host}sso/api/check_code")
    private String callbackUrl;

    @Value("${auth.host}sso/api/check_ticket")
    private String ticketUrl;

    @Value("${sso.cookie.ticket}")
    private String cookieTicketName;

    @Value("${sso.cookie.username}")
    private String cookieUsernameName;

    public void setUserCookie(HttpServletRequest request, HttpServletResponse response, String ticket,
                                     String userName) {
        Cookie cookieTicket = new Cookie(cookieTicketName, ticket);
        cookieTicket.setPath("/");
        Cookie cookieUsername = new Cookie(cookieUsernameName, userName);
        cookieUsername.setPath("/");
        response.addCookie(cookieTicket);
        response.addCookie(cookieUsername);
    }

    /**
     * 退出时清空cookie
     * @param request
     * @param response
     */
    public void clearCookies(HttpServletRequest request, HttpServletResponse response) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookieTicketName.equals(cookie.getName()) || cookieUsernameName.equals(cookie.getName())) {
                    cookie.setMaxAge(0);
                    cookie.setPath("/");
                    response.addCookie(cookie);
                }
            }
        }
    }

    public String getUsernameFromCookie(HttpServletRequest request, HttpServletResponse response) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookieUsernameName.equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }

    public String getTicketFromCookie(HttpServletRequest request, HttpServletResponse response) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookieTicketName.equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }

    public boolean checkLogin(HttpServletRequest request, HttpServletResponse response) {
        String ticket = this.getTicketFromCookie(request, response);
        if (StringUtils.isEmpty(ticket)) {
            return false;
        }
        boolean ret = this.validTicket(ticket);
        if (ret == true) {
                String username = this.getUsernameFromCookie(request,response);
                setUserCookie(request,response,ticket,username);
                return true;
        }
        return false;
    }

    public String loginRequired(String currentUrl) {
        String encodeUrl = "";
        try {
            encodeUrl = URLEncoder.encode(currentUrl, "UTF-8");
        } catch (UnsupportedEncodingException e) {
            logger.error("url encode error ", currentUrl);
        }
        String url = this.getLoginUrl();
        if (StringUtils.isNotEmpty(encodeUrl)) {
            url = this.getLoginUrl() + "&jumpto=" + encodeUrl;
        }

        return url;
    }

    public String validCode(String code) {

        Map<String, String> requestParam = Maps.newHashMap();
        requestParam.put("code", code);
        requestParam.put("app_key", appKey);
        requestParam.put("app_id", jetAppId);

        String response = HttpClientUtils.post(callbackUrl, requestParam);
        logger.info("invoke sso service valid code,url:{},code:{},app_key:{},app_id:{},response:{}", callbackUrl, code,
            appKey, jetAppId, response);
        return response;
    }

    public boolean validTicket(String ticket) {
        Map<String, String> requestParam = Maps.newHashMap();
        requestParam.put("ticket", ticket);
        requestParam.put("app_id", jetAppId);

        boolean result = false;
        try {
            String response = HttpClientUtils.post(ticketUrl, requestParam);
            logger.info("invoke sso service valid ticket,url:{},ticket:{},app_id:{},response:{}", ticketUrl, ticket,
                jetAppId, response);
            if (StringUtils.isNotEmpty(response)) {
                JSONObject jsonObject = JSONObject.parseObject(response);
                if (jsonObject != null) {
                    // 默认值不能为0
                    int errno = NumberUtils.toInt(String.valueOf(jsonObject.get("errno")), 1);
                    result = errno == 0;
                }
            }
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }

        return result;
    }

    public boolean checkCode(HttpServletRequest request, HttpServletResponse response) throws IOException,
        ServletException {
        String code = WebUtils.findParameterValue(request, "code");
        if (StringUtils.isNotEmpty(code)) {
            String result = validCode(code);
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
                    setUserCookie(request, response, ticket, userName);
                    return true;
                }
            }
        } else {
            logger.error("code empty");
        }
        return false;
    }

    public void setTicketUrl(String ticketUrl) {
        this.ticketUrl = ticketUrl;
    }

    public String getTicketUrl() {
        return ticketUrl;
    }

    public void setCallbackUrl(String callbackUrl) {
        this.callbackUrl = callbackUrl;
    }

    public String getCallbackUrl() {
        return callbackUrl;
    }

    public void setAppKey(String appKey) {
        this.appKey = appKey;
    }

    public String getAppKey() {
        return appKey;
    }

    public void setJetAppId(String jetAppId) {
        this.jetAppId = jetAppId;
    }

    public String getJetAppId() {
        return jetAppId;
    }

    public void setLoginUrl(String loginUrl) {
        this.loginUrl = loginUrl;
    }

    public String getLoginUrl() {
        return loginUrl;
    }

    public void setLogoutUrl(String logoutUrl) {
        this.logoutUrl = logoutUrl;
    }

    public String getLogoutUrl() {
        return logoutUrl;
    }

    public String getCookieTicketName() {
        return cookieTicketName;
    }

    public void setCookieTicketName(String cookieTicketName) {
        this.cookieTicketName = cookieTicketName;
    }

    public String getCookieUsernameName() {
        return cookieUsernameName;
    }

    public void setCookieUsernameName(String cookieUsernameName) {
        this.cookieUsernameName = cookieUsernameName;
    }
}
