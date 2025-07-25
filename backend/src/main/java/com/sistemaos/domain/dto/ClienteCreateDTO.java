package com.sistemaos.domain.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClienteCreateDTO {
    
    @NotBlank(message = "Documento é obrigatório")
    private String documento;
    
    @NotBlank(message = "Nome é obrigatório")
    private String nome;
    
    @NotBlank(message = "Contato é obrigatório")
    private String contato;
    
    @NotBlank(message = "Endereço é obrigatório")
    private String endereco;
} 