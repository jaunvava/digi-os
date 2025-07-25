package com.sistemaos.domain.dto;

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
public class RelatorioDTO {
    private LocalDateTime dataInicio;
    private LocalDateTime dataFim;
    private Long totalOS;
    private BigDecimal valorTotal;
    private List<OrdemServicoDTO> ordens;
} 