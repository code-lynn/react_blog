package com.didichuxing.decision.tools.http;

import com.didichuxing.decision.tools.Configuration;
import com.google.common.base.Throwables;
import org.apache.http.HttpEntity;
import org.apache.http.NameValuePair;
import org.apache.http.client.HttpClient;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpUriRequest;
import org.apache.http.config.RegistryBuilder;
import org.apache.http.conn.socket.ConnectionSocketFactory;
import org.apache.http.conn.socket.PlainConnectionSocketFactory;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.entity.mime.content.FileBody;
import org.apache.http.impl.NoConnectionReuseStrategy;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.impl.conn.PoolingHttpClientConnectionManager;
import org.apache.http.message.BasicNameValuePair;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * httpclient工具类
 */
public class HttpClientUtils {

    private static final Logger logger                    = LoggerFactory
        .getLogger(HttpClientUtils.class);
    private static final String                       HTTPCLIENT_CONNECTTIMEOUT = "httpclient.connectTimeout";
    private static final String                       HTTPCLIENT_SOCKETTIMEOUT  = "httpclient.socketTimeout";
    private static final String                       HTTPCLIENT_AGENT          = "httpclient.agent";
    private static PoolingHttpClientConnectionManager poolingmgr;
    private static HttpClient                         httpClient;

    static {
        Integer connectTimeOut = Configuration.getInt(HTTPCLIENT_CONNECTTIMEOUT);
        Integer socketTimeOut = Configuration.getInt(HTTPCLIENT_SOCKETTIMEOUT);
        String agentStr = Configuration.getString(HTTPCLIENT_AGENT);
        RequestConfig requestConfig = RequestConfig.custom().setConnectTimeout(connectTimeOut)
            .setSocketTimeout(socketTimeOut).build();
        poolingmgr = new PoolingHttpClientConnectionManager(RegistryBuilder.<ConnectionSocketFactory> create()
            .register("http", PlainConnectionSocketFactory.getSocketFactory()).build());
        poolingmgr.setDefaultMaxPerRoute(10);
        poolingmgr.setMaxTotal(100);
        httpClient = HttpClientBuilder.create().setDefaultRequestConfig(requestConfig).setUserAgent(agentStr)
            .setConnectionManager(poolingmgr).setConnectionReuseStrategy(new NoConnectionReuseStrategy()).build();
    }

    /**
     * get method获取字符串响应
     * 
     * @param request
     * @return
     */
    public static String getContent(HttpUriRequest request) {
        ResponseHandler<String> responseHandler = new BasicResponseHandlerEx();
        String content = null;
        try {
            content = httpClient.execute(request, responseHandler);
        } catch (IOException e) {
            logger.error(request.getRequestLine().toString(), e);
            request.abort();
        } catch (Exception e) {
            logger.error("Unkown Exception" + e.getMessage(), e);
            Throwables.propagate(e);
        }
        return content;
    }

    /**
     * get method获取字符串响应
     * 
     * @param url
     * @return
     */
    public static String getContent(String url) {
        HttpGet httpGet = new HttpGet(url);
        return getContent(httpGet);
    }

    /**
     * post 获取 字符串响应
     * 
     * @param url
     * @param params
     * @return
     */
    public static String post(String url, Map<String, String> params) {
        List<NameValuePair> postParameters = new ArrayList<NameValuePair>();
        if (!params.isEmpty()) {
            for (Map.Entry<String, String> entry : params.entrySet()) {
                postParameters.add(new BasicNameValuePair(entry.getKey(), entry.getValue()));
            }
        }
        HttpPost post = new HttpPost(url);
        try {
            post.setEntity(new UrlEncodedFormEntity(postParameters));
        } catch (UnsupportedEncodingException e) {
            Throwables.propagate(e);
        }
        return getContent(post);
    }

    public static HttpPost buildFileUploadPost(String url, File file, String fileContentName) {
        HttpPost httpPost = new HttpPost(url);
        HttpEntity httpEntity = HttpClientUtils.buildHttpEntity(file, "filecontent");
        httpPost.setEntity(httpEntity);
        return httpPost;
    }

    /**
     * 构建 http 实体
     * @param file
     * @param fileContentName
     * @return
     */
    public static HttpEntity buildHttpEntity(File file, String fileContentName) {
        FileBody body = new FileBody(file, ContentType.APPLICATION_OCTET_STREAM);
        MultipartEntityBuilder builder = MultipartEntityBuilder.create().addPart(fileContentName, body);
        return builder.build();
    }

}
