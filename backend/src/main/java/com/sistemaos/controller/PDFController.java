package com.sistemaos.controller;

import com.sistemaos.service.PDFService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pdf")
@RequiredArgsConstructor
public class PDFController {

    private final PDFService pdfService;

    @GetMapping("/ordem-servico/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'OPERADOR')")
    public ResponseEntity<byte[]> gerarPDFOrdemServico(@PathVariable Long id) {
        byte[] pdf = pdfService.gerarPDF(id);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("filename", "ordem-servico.pdf");
        return ResponseEntity.ok()
                .headers(headers)
                .body(pdf);
    }
} 