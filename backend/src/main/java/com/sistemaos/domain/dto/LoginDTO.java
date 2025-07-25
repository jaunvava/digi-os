package com.sistemaos.domain.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.ToString;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = "senha")
public class LoginDTO {
    @NotBlank(message = "Email é obrigatório")
    @JsonProperty("email")
    private String email;

    @NotBlank(message = "Senha é obrigatória")
    @JsonProperty("senha")
    private String senha;
} 