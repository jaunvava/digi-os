package com.sistemaos.domain.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsuarioUpdateDTO {
    private String nome;
    private String email;
    private String telefone;
    private String endereco;
    private String avatar;
} 