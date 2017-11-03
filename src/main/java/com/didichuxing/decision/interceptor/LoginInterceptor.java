package com.didichuxing.decision.interceptor;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.didichuxing.decision.service.SSOService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;
import org.springframework.web.util.WebUtils;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Created by didi on 2017/10/31.
 */
public class LoginInterceptor extends HandlerInterceptorAdapter{

    @Autowired
    private SSOService ssoService;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {

        String code = WebUtils.findParameterValue(request, "code");
        boolean flag = false;
        if (StringUtils.isNoneEmpty(code)){
            String result = ssoService.validCode(code);
            JSONObject rootObject = JSON.parseObject(result);
            Integer error = rootObject.getInteger("errno");
            JSONObject dataObject = rootObject.getJSONObject("data");
            if (error == 0 || dataObject != null) {
                flag = true;
            }
            else {
                String currentUrl = request.getRequestURL().toString();
                response.sendRedirect(ssoService.loginRequired(currentUrl));
                flag = false;
            }
        }

        return flag;
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
        super.postHandle(request, response, handler, modelAndView);
    }
}
