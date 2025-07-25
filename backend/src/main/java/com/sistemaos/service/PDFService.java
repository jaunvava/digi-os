package com.sistemaos.service;

import com.lowagie.text.*;
import com.lowagie.text.pdf.*;
import com.sistemaos.domain.entity.OrdemServico;
import com.sistemaos.domain.entity.EquipamentoUsado;
import com.sistemaos.repository.OrdemServicoRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class PDFService {

    private final OrdemServicoRepository ordemServicoRepository;
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm", new Locale("pt", "BR"));

    public byte[] gerarPDF(Long ordemServicoId) {
        try {
            OrdemServico os = ordemServicoRepository.findById(ordemServicoId)
                    .orElseThrow(() -> new EntityNotFoundException("Ordem de Serviço não encontrada"));

            Document document = new Document(PageSize.A4);
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            PdfWriter.getInstance(document, baos);

            document.open();
            adicionarCabecalho(document, os);
            adicionarInformacoesCliente(document, os);
            adicionarInformacoesEquipamento(document, os);
            adicionarDescricaoServico(document, os);
            adicionarEquipamentosUsados(document, os);
            document.close();

            return baos.toByteArray();
        } catch (EntityNotFoundException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Erro ao gerar PDF: " + e.getMessage(), e);
        }
    }

    private void adicionarCabecalho(Document document, OrdemServico os) throws DocumentException {
        Paragraph header = new Paragraph();
        header.setAlignment(Element.ALIGN_CENTER);
        header.add(new Chunk("ORDEM DE SERVIÇO\n", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16)));
        header.add(new Chunk("Nº " + os.getNumero() + "\n\n", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14)));
        document.add(header);
    }

    private void adicionarInformacoesCliente(Document document, OrdemServico os) throws DocumentException {
        Paragraph clienteInfo = new Paragraph();
        clienteInfo.add(new Chunk("INFORMAÇÕES DO CLIENTE\n", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12)));
        clienteInfo.add(String.format("Nome: %s\n", os.getNomeCliente()));
        clienteInfo.add(String.format("Documento: %s\n", os.getDocumentoCliente()));
        clienteInfo.add(String.format("Telefone: %s\n", os.getTelefoneCliente()));
        clienteInfo.add(String.format("Endereço: %s\n\n", os.getEnderecoCliente()));
        document.add(clienteInfo);
    }

    private void adicionarInformacoesEquipamento(Document document, OrdemServico os) throws DocumentException {
        Paragraph equipInfo = new Paragraph();
        equipInfo.add(new Chunk("INFORMAÇÕES DO EQUIPAMENTO\n", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12)));
        equipInfo.add(String.format("Equipamento: %s\n", os.getEquipamento()));
        equipInfo.add(String.format("Marca: %s\n", os.getMarca()));
        equipInfo.add(String.format("Modelo: %s\n", os.getModelo()));
        equipInfo.add(String.format("Número de Série: %s\n\n", os.getNumeroSerie()));
        document.add(equipInfo);
    }

    private void adicionarDescricaoServico(Document document, OrdemServico os) throws DocumentException {
        Paragraph servicoInfo = new Paragraph();
        servicoInfo.add(new Chunk("DESCRIÇÃO DO SERVIÇO\n", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12)));
        servicoInfo.add(String.format("Data de Abertura: %s\n", os.getDataAbertura().format(FORMATTER)));
        if (os.getDataFechamento() != null) {
            servicoInfo.add(String.format("Data de Fechamento: %s\n", os.getDataFechamento().format(FORMATTER)));
        }
        servicoInfo.add(String.format("Status: %s\n", os.getStatus()));
        servicoInfo.add(String.format("Problema Relatado: %s\n", os.getDescricaoProblema()));
        if (os.getSolucao() != null) {
            servicoInfo.add(String.format("Solução: %s\n", os.getSolucao()));
        }
        servicoInfo.add(String.format("Valor Total: R$ %.2f\n\n", os.getValorTotal()));
        document.add(servicoInfo);
    }

    private void adicionarEquipamentosUsados(Document document, OrdemServico os) throws DocumentException {
        if (os.getEquipamentosUsados() == null || os.getEquipamentosUsados().isEmpty()) {
            return;
        }

        Paragraph equipUsadosHeader = new Paragraph();
        equipUsadosHeader.add(new Chunk("EQUIPAMENTOS/PEÇAS UTILIZADOS\n", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12)));
        document.add(equipUsadosHeader);

        PdfPTable table = new PdfPTable(4);
        table.setWidthPercentage(100);
        table.setSpacingBefore(10f);
        table.setSpacingAfter(10f);

        // Cabeçalho da tabela
        table.addCell(new PdfPCell(new Phrase("Produto", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10))));
        table.addCell(new PdfPCell(new Phrase("Quantidade", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10))));
        table.addCell(new PdfPCell(new Phrase("Valor Unitário", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10))));
        table.addCell(new PdfPCell(new Phrase("Valor Total", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10))));

        // Dados dos equipamentos
        for (EquipamentoUsado equip : os.getEquipamentosUsados()) {
            table.addCell(equip.getProduto().getNome());
            table.addCell(String.valueOf(equip.getQuantidade()));
            table.addCell(String.format("R$ %.2f", equip.getValorUnitario()));
            table.addCell(String.format("R$ %.2f", equip.getValorTotal()));
        }

        document.add(table);
    }
} 