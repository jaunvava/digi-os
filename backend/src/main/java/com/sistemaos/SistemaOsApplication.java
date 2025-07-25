package com.sistemaos;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;

@SpringBootApplication
@OpenAPIDefinition(
    info = @Info(
        title = "Sistema OS API",
        version = "1.0",
        description = "API do Sistema de Gerenciamento de Ordens de Serviço"
    )
)
public class SistemaOsApplication {
    public static void main(String[] args) {
        SpringApplication.run(SistemaOsApplication.class, args);
    }
} 