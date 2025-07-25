package com.sistemaos.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClienteDTO {
    private Long id;
    private String documento;
    private String nome;
    private String contato;
    private String endereco;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 