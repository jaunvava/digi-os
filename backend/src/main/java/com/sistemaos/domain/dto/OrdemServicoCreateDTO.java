package com.sistemaos.domain.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrdemServicoCreateDTO {
    @NotBlank(message = "Nome do cliente é obrigatório")
    private String nomeCliente;

    @NotBlank(message = "Documento do cliente é obrigatório")
    private String documentoCliente;

    @NotBlank(message = "Telefone do cliente é obrigatório")
    private String telefoneCliente;

    @NotBlank(message = "Endereço do cliente é obrigatório")
    private String enderecoCliente;

    @NotBlank(message = "Descrição do problema é obrigatória")
    private String descricaoProblema;

    @NotBlank(message = "Descrição dos equipamentos é obrigatória")
    private String equipamento;

    @NotNull(message = "ID do responsável é obrigatório")
    private Long responsavelId;

    private String marca;
    private String modelo;
    private String numeroSerie;
    private List<EquipamentoUsadoDTO> equipamentosUsados;
} 