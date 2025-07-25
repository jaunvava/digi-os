package com.sistemaos.domain.dto;

import com.sistemaos.domain.entity.Produto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProdutoDTO {
    private Long id;
    private String nome;
    private String descricao;
    private BigDecimal preco;
    private Integer quantidadeEstoque;
    private String unidadeMedida;
    private String categoria;
    private LocalDateTime dataCadastro;
    private LocalDateTime dataAtualizacao;

    public static ProdutoDTO fromEntity(Produto produto) {
        return new ProdutoDTO(
            produto.getId(),
            produto.getNome(),
            produto.getDescricao(),
            produto.getPreco(),
            produto.getQuantidadeEstoque(),
            produto.getUnidadeMedida(),
            produto.getCategoria(),
            produto.getDataCadastro(),
            produto.getDataAtualizacao()
        );
    }
} 