package com.sistemaos.domain.dto;

import com.sistemaos.domain.entity.OrdemServico;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrdemServicoDTO {
    private Long id;
    private String numero;
    private String nomeCliente;
    private String documentoCliente;
    private String telefoneCliente;
    private String enderecoCliente;
    private UsuarioDTO responsavel;
    private LocalDateTime dataAbertura;
    private LocalDateTime dataFechamento;
    private OrdemServico.StatusOrdemServico status;
    private String descricaoProblema;
    private String solucao;
    private BigDecimal valorTotal;
    private String equipamento;
    private String marca;
    private String modelo;
    private String numeroSerie;
    private List<EquipamentoUsadoDTO> equipamentosUsados;
} 