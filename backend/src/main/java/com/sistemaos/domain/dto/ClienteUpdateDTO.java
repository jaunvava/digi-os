package com.sistemaos.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClienteUpdateDTO {
    private String documento;
    private String nome;
    private String contato;
    private String endereco;
} 