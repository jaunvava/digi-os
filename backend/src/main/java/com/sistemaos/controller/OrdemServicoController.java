package com.sistemaos.controller;

import com.sistemaos.domain.dto.OrdemServicoDTO;
import com.sistemaos.domain.dto.OrdemServicoCreateDTO;
import com.sistemaos.domain.dto.OrdemServicoUpdateDTO;
import com.sistemaos.domain.dto.RelatorioDTO;
import com.sistemaos.service.OrdemServicoService;
import com.sistemaos.service.PDFService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ordens-servico")
@RequiredArgsConstructor
@Tag(name = "Ordens de Serviço", description = "Endpoints para gerenciamento de ordens de serviço")
@SecurityRequirement(name = "bearerAuth")
public class OrdemServicoController {

    private final OrdemServicoService ordemServicoService;
    private final PDFService pdfService;

    @PostMapping
    @Operation(summary = "Criar OS", description = "Cria uma nova ordem de serviço")
    @PreAuthorize("hasAnyRole('ADMIN', 'OPERADOR')")
    public ResponseEntity<OrdemServicoDTO> criar(@RequestBody @Valid OrdemServicoCreateDTO dto) {
        OrdemServicoDTO novaOS = ordemServicoService.criar(dto);
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(novaOS.getId())
                .toUri();
        return ResponseEntity.created(location).body(novaOS);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar OS", description = "Busca uma ordem de serviço pelo ID")
    @PreAuthorize("hasAnyRole('ADMIN', 'OPERADOR')")
    public ResponseEntity<OrdemServicoDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(ordemServicoService.buscarPorId(id));
    }

    @GetMapping("/responsavel/{responsavelId}")
    @Operation(summary = "Listar OS por responsável", description = "Lista todas as ordens de serviço de um responsável")
    @PreAuthorize("hasAnyRole('ADMIN', 'OPERADOR')")
    public ResponseEntity<Page<OrdemServicoDTO>> buscarPorResponsavel(
            @PathVariable Long responsavelId,
            Pageable pageable) {
        return ResponseEntity.ok(ordemServicoService.buscarPorResponsavel(responsavelId, pageable));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar OS", description = "Atualiza uma ordem de serviço")
    @PreAuthorize("hasAnyRole('ADMIN', 'OPERADOR')")
    public ResponseEntity<OrdemServicoDTO> atualizar(
            @PathVariable Long id,
            @RequestBody @Valid OrdemServicoUpdateDTO dto) {
        return ResponseEntity.ok(ordemServicoService.atualizar(id, dto));
    }

    @GetMapping("/relatorio")
    @Operation(summary = "Gerar relatório", description = "Gera um relatório de ordens de serviço por período")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RelatorioDTO> gerarRelatorio(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fim) {
        return ResponseEntity.ok(ordemServicoService.gerarRelatorio(inicio, fim));
    }

    @GetMapping
    @Operation(summary = "Listar todas OS", description = "Lista todas as ordens de serviço (apenas admin)")
    @PreAuthorize("hasAnyRole('ADMIN', 'OPERADOR')")
    public ResponseEntity<Page<OrdemServicoDTO>> listarTodas(Pageable pageable) {
        return ResponseEntity.ok(ordemServicoService.listarTodas(pageable));
    }

    @GetMapping("/{id}/pdf")
    @PreAuthorize("hasAnyRole('ADMIN', 'OPERADOR')")
    public ResponseEntity<byte[]> gerarPDF(@PathVariable Long id) {
        byte[] pdf = pdfService.gerarPDF(id);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("filename", "ordem-servico.pdf");
        return ResponseEntity.ok()
                .headers(headers)
                .body(pdf);
    }

    @GetMapping("/status-count")
    public ResponseEntity<List<Map<String, Object>>> getStatusCount() {
        List<Map<String, Object>> statusCount = ordemServicoService.getStatusCount();
        return ResponseEntity.ok(statusCount);
    }
} 