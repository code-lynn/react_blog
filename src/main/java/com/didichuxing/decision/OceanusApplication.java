package com.didichuxing.decision;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Hello world!
 */
@SpringBootApplication
@MapperScan("com.didichuxing.decision.dao")
public class OceanusApplication {

    public static void main(String[] args) {
        SpringApplication.run(OceanusApplication.class, args);
    }
}
