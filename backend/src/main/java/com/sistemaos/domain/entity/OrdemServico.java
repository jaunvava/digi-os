package com.sistemaos.domain.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrdemServico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String numero;

    private String nomeCliente;
    private String documentoCliente;
    private String telefoneCliente;
    private String enderecoCliente;

    @ManyToOne
    @JoinColumn(name = "responsavel_id")
    private Usuario responsavel;

    @Column(nullable = false)
    private String equipamento;

    @Column(nullable = false)
    private String descricaoProblema;

    private String solucao;

    @Column(nullable = false)
    private LocalDateTime dataAbertura;

    private LocalDateTime dataFechamento;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private StatusOrdemServico status;

    @Column(nullable = false)
    private BigDecimal valorTotal;

    private String marca;
    private String modelo;
    private String numeroSerie;

    @OneToMany(mappedBy = "ordemServico", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<EquipamentoUsado> equipamentosUsados;

    public enum StatusOrdemServico {
        ABERTA,
        EM_ANDAMENTO,
        AGUARDANDO_PECA,
        AGUARDANDO_APROVACAO,
        CONCLUIDA,
        CANCELADA
    }
} 