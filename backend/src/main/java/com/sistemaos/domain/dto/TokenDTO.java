package com.sistemaos.domain.dto;

import com.sistemaos.domain.entity.Usuario;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TokenDTO {
    private String token;
    private String tipo;
    private Long id;
    private String nome;
    private String email;
    private Usuario.TipoUsuario tipoUsuario;
    private String avatar;
} 