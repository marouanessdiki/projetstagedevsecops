package com.netcon.gestion_salaries;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class GestionSalariesApplication {

    public static void main(String[] args) {
        SpringApplication.run(GestionSalariesApplication.class, args);
    }

}
