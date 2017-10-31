package com.didichuxing.decision.tools;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

/**
 * Created by didi on 2017/10/31.
 */
public class Configuration {
    private static final Logger LOGGER = LoggerFactory.getLogger(Configuration.class);

    private static final Properties properties = new Properties();
    private static final Map<String, String> configuration = new HashMap<>();

    static {
        initConfiguration();
    }

    public static String getString(String key){
        return properties.getProperty(key);
    }

    public static int getInt(String key){
        return Integer.parseInt(properties.getProperty(key));
    }

    private static void initConfiguration(){
        try (InputStream in = Configuration.class.getClassLoader().getResourceAsStream(Const.CONFIG_FILE)){
            properties.load(in);
        }
        catch (Exception e){
            LOGGER.error(Const.ERROR_MSG_PREFIX + "Failed to read configuration file " + Const.CONFIG_FILE, e);
        }
    }
}
