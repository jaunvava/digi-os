package com.sistemaos.domain.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EquipamentoUsadoDTO {
    private Long produtoId;
    private String nome;
    private Integer quantidade;
    private BigDecimal valorUnitario;
    private BigDecimal valorTotal;
} 