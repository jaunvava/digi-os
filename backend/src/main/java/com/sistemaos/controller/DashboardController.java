package com.sistemaos.controller;

import com.sistemaos.domain.entity.OrdemServico;
import com.sistemaos.domain.entity.OrdemServico.StatusOrdemServico;
import com.sistemaos.domain.entity.Produto;
import com.sistemaos.repository.OrdemServicoRepository;
import com.sistemaos.repository.ProdutoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final OrdemServicoRepository ordemServicoRepository;
    private final ProdutoRepository produtoRepository;

    @GetMapping("/stats")
    @PreAuthorize("hasAnyRole('ADMIN', 'OPERADOR')")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        List<OrdemServico> ordens = ordemServicoRepository.findAll();
        List<Produto> produtos = produtoRepository.findAll();

        long ordensAbertas = ordens.stream()
                .filter(o -> o.getStatus() == StatusOrdemServico.ABERTA)
                .count();

        long ordensEmAndamento = ordens.stream()
                .filter(o -> o.getStatus() == StatusOrdemServico.EM_ANDAMENTO)
                .count();

        long ordensConcluidas = ordens.stream()
                .filter(o -> o.getStatus() == StatusOrdemServico.CONCLUIDA)
                .count();

        long ordensCanceladas = ordens.stream()
                .filter(o -> o.getStatus() == StatusOrdemServico.CANCELADA)
                .count();

        BigDecimal faturamentoTotal = ordens.stream()
                .filter(o -> o.getStatus() == StatusOrdemServico.CONCLUIDA)
                .map(OrdemServico::getValorTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal ticketMedio = ordensConcluidas > 0 
            ? faturamentoTotal.divide(BigDecimal.valueOf(ordensConcluidas), 2, java.math.RoundingMode.HALF_UP) 
            : BigDecimal.ZERO;

        long produtosBaixoEstoque = produtos.stream()
                .filter(p -> p.getQuantidadeEstoque() < 10)
                .count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalOrdensAbertas", ordensAbertas);
        stats.put("totalOrdensEmAndamento", ordensEmAndamento);
        stats.put("totalOrdensConcluidas", ordensConcluidas);
        stats.put("totalOrdensCanceladas", ordensCanceladas);
        stats.put("faturamentoTotal", faturamentoTotal);
        stats.put("ticketMedio", ticketMedio);
        stats.put("produtosBaixoEstoque", produtosBaixoEstoque);

        return ResponseEntity.ok(stats);
    }
} 