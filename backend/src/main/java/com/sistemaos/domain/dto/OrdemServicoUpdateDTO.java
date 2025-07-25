package com.sistemaos.domain.dto;

import com.sistemaos.domain.entity.OrdemServico;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrdemServicoUpdateDTO {
    private String nomeCliente;
    private String documentoCliente;
    private String telefoneCliente;
    private String enderecoCliente;
    private String descricaoProblema;
    private String equipamento;
    private String marca;
    private String modelo;
    private String numeroSerie;
    private OrdemServico.StatusOrdemServico status;
    private String solucao;
    private BigDecimal valorTotal;
    private List<EquipamentoUsadoDTO> equipamentosUsados;
} 