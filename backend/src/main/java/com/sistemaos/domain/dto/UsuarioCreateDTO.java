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
public class UsuarioCreateDTO {
    private String nome;
    private String email;
    private String senha;
    private Usuario.TipoUsuario tipo;
    private String telefone;
    private String avatar;
} 