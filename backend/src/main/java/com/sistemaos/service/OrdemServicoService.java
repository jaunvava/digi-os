package com.sistemaos.service;

import com.sistemaos.domain.dto.OrdemServicoDTO;
import com.sistemaos.domain.dto.OrdemServicoCreateDTO;
import com.sistemaos.domain.dto.OrdemServicoUpdateDTO;
import com.sistemaos.domain.dto.RelatorioDTO;
import com.sistemaos.domain.dto.UsuarioDTO;
import com.sistemaos.domain.dto.EquipamentoUsadoDTO;
import com.sistemaos.domain.entity.EquipamentoUsado;
import com.sistemaos.domain.entity.OrdemServico;
import com.sistemaos.domain.entity.Produto;
import com.sistemaos.domain.entity.Usuario;
import com.sistemaos.repository.EquipamentoUsadoRepository;
import com.sistemaos.repository.OrdemServicoRepository;
import com.sistemaos.repository.ProdutoRepository;
import com.sistemaos.repository.UsuarioRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrdemServicoService {

    private final OrdemServicoRepository ordemServicoRepository;
    private final UsuarioRepository usuarioRepository;
    private final ProdutoRepository produtoRepository;
    private final EquipamentoUsadoRepository equipamentoUsadoRepository;
    private final PDFService pdfService;

    @Transactional
    public OrdemServicoDTO criar(OrdemServicoCreateDTO dto) {
        Usuario responsavel = usuarioRepository.findById(dto.getResponsavelId())
                .orElseThrow(() -> new EntityNotFoundException("Responsável não encontrado"));

        OrdemServico ordemServico = OrdemServico.builder()
                .numero(gerarNumeroOS())
                .nomeCliente(dto.getNomeCliente())
                .documentoCliente(dto.getDocumentoCliente())
                .telefoneCliente(dto.getTelefoneCliente())
                .enderecoCliente(dto.getEnderecoCliente())
                .responsavel(responsavel)
                .dataAbertura(LocalDateTime.now())
                .status(OrdemServico.StatusOrdemServico.ABERTA)
                .descricaoProblema(dto.getDescricaoProblema())
                .equipamento(dto.getEquipamento())
                .marca(dto.getMarca())
                .modelo(dto.getModelo())
                .numeroSerie(dto.getNumeroSerie())
                .valorTotal(BigDecimal.ZERO)
                .equipamentosUsados(new ArrayList<>())
                .build();

        ordemServico = ordemServicoRepository.save(ordemServico);

        if (dto.getEquipamentosUsados() != null && !dto.getEquipamentosUsados().isEmpty()) {
            processarEquipamentosUsados(ordemServico, dto.getEquipamentosUsados());
        }

        return converterParaDTO(ordemServico);
    }

    @Transactional(readOnly = true)
    public OrdemServicoDTO buscarPorId(Long id) {
        OrdemServico ordemServico = ordemServicoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Ordem de Serviço não encontrada"));
        return converterParaDTO(ordemServico);
    }

    @Transactional(readOnly = true)
    public Page<OrdemServicoDTO> buscarPorResponsavel(Long responsavelId, Pageable pageable) {
        Usuario responsavel = usuarioRepository.findById(responsavelId)
                .orElseThrow(() -> new EntityNotFoundException("Responsável não encontrado"));
        return ordemServicoRepository.findByResponsavel(responsavel, pageable)
                .map(this::converterParaDTO);
    }

    @Transactional(readOnly = true)
    public Page<OrdemServicoDTO> listarTodas(Pageable pageable) {
        return ordemServicoRepository.findAll(pageable)
                .map(this::converterParaDTO);
    }

    @Transactional
    public OrdemServicoDTO atualizar(Long id, OrdemServicoUpdateDTO dto) {
        OrdemServico ordemServico = ordemServicoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Ordem de Serviço não encontrada"));

        ordemServico.setNomeCliente(dto.getNomeCliente());
        ordemServico.setDocumentoCliente(dto.getDocumentoCliente());
        ordemServico.setTelefoneCliente(dto.getTelefoneCliente());
        ordemServico.setEnderecoCliente(dto.getEnderecoCliente());
        ordemServico.setDescricaoProblema(dto.getDescricaoProblema());
        ordemServico.setEquipamento(dto.getEquipamento());
        ordemServico.setMarca(dto.getMarca());
        ordemServico.setModelo(dto.getModelo());
        ordemServico.setNumeroSerie(dto.getNumeroSerie());
        ordemServico.setStatus(dto.getStatus());
        ordemServico.setSolucao(dto.getSolucao());
        
        if (dto.getStatus() == OrdemServico.StatusOrdemServico.CONCLUIDA) {
            ordemServico.setDataFechamento(LocalDateTime.now());
        }

        // Atualiza equipamentos usados
        ordemServico.getEquipamentosUsados().clear();
        if (dto.getEquipamentosUsados() != null && !dto.getEquipamentosUsados().isEmpty()) {
            processarEquipamentosUsados(ordemServico, dto.getEquipamentosUsados());
        }

        ordemServico = ordemServicoRepository.save(ordemServico);
        
        // Se a OS foi concluída, gera o PDF
        if (dto.getStatus() == OrdemServico.StatusOrdemServico.CONCLUIDA) {
            pdfService.gerarPDF(ordemServico.getId());
        }
        
        return converterParaDTO(ordemServico);
    }

    @Transactional(readOnly = true)
    public RelatorioDTO gerarRelatorio(LocalDateTime inicio, LocalDateTime fim) {
        List<OrdemServico> ordens = ordemServicoRepository.findByPeriodo(inicio, fim);
        
        BigDecimal valorTotal = ordens.stream()
                .map(OrdemServico::getValorTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return RelatorioDTO.builder()
                .dataInicio(inicio)
                .dataFim(fim)
                .totalOS((long) ordens.size())
                .valorTotal(valorTotal)
                .ordens(ordens.stream().map(this::converterParaDTO).collect(Collectors.toList()))
                .build();
    }

    private String gerarNumeroOS() {
        return String.format("OS%d%d", System.currentTimeMillis(), 
                ordemServicoRepository.count() + 1);
    }

    private void processarEquipamentosUsados(OrdemServico ordemServico, List<EquipamentoUsadoDTO> equipamentosUsadosDTO) {
        BigDecimal valorTotal = BigDecimal.ZERO;
        
        for (EquipamentoUsadoDTO equipDTO : equipamentosUsadosDTO) {
            Produto produto = produtoRepository.findById(equipDTO.getProdutoId())
                    .orElseThrow(() -> new EntityNotFoundException("Produto não encontrado: " + equipDTO.getProdutoId()));

            EquipamentoUsado equipUsado = EquipamentoUsado.builder()
                    .ordemServico(ordemServico)
                    .produto(produto)
                    .quantidade(equipDTO.getQuantidade())
                    .valorUnitario(produto.getPreco())
                    .valorTotal(produto.getPreco().multiply(BigDecimal.valueOf(equipDTO.getQuantidade())))
                    .build();

            ordemServico.getEquipamentosUsados().add(equipUsado);
            valorTotal = valorTotal.add(equipUsado.getValorTotal());
        }

        ordemServico.setValorTotal(valorTotal);
    }

    private OrdemServicoDTO converterParaDTO(OrdemServico os) {
        return OrdemServicoDTO.builder()
                .id(os.getId())
                .numero(os.getNumero())
                .nomeCliente(os.getNomeCliente())
                .documentoCliente(os.getDocumentoCliente())
                .telefoneCliente(os.getTelefoneCliente())
                .enderecoCliente(os.getEnderecoCliente())
                .responsavel(converterUsuarioParaDTO(os.getResponsavel()))
                .dataAbertura(os.getDataAbertura())
                .dataFechamento(os.getDataFechamento())
                .status(os.getStatus())
                .descricaoProblema(os.getDescricaoProblema())
                .solucao(os.getSolucao())
                .valorTotal(os.getValorTotal())
                .equipamento(os.getEquipamento())
                .marca(os.getMarca())
                .modelo(os.getModelo())
                .numeroSerie(os.getNumeroSerie())
                .equipamentosUsados(os.getEquipamentosUsados().stream()
                    .map(this::converterEquipamentoUsadoParaDTO)
                    .collect(Collectors.toList()))
                .build();
    }

    private EquipamentoUsadoDTO converterEquipamentoUsadoParaDTO(EquipamentoUsado equipamento) {
        return EquipamentoUsadoDTO.builder()
                .produtoId(equipamento.getProduto().getId())
                .nome(equipamento.getProduto().getNome())
                .quantidade(equipamento.getQuantidade())
                .valorUnitario(equipamento.getValorUnitario())
                .valorTotal(equipamento.getValorTotal())
                .build();
    }

    private UsuarioDTO converterUsuarioParaDTO(Usuario usuario) {
        return UsuarioDTO.builder()
                .id(usuario.getId())
                .nome(usuario.getNome())
                .email(usuario.getEmail())
                .tipo(usuario.getTipo())
                .telefone(usuario.getTelefone())
                .build();
    }

    public List<Map<String, Object>> getStatusCount() {
        Map<OrdemServico.StatusOrdemServico, Long> countByStatus = ordemServicoRepository.findAll().stream()
                .collect(Collectors.groupingBy(
                        OrdemServico::getStatus,
                        Collectors.counting()
                ));
        
        return countByStatus.entrySet().stream()
                .map(entry -> {
                    Map<String, Object> result = new java.util.HashMap<>();
                    result.put("status", entry.getKey());
                    result.put("count", entry.getValue());
                    return result;
                })
                .collect(Collectors.toList());
    }
} 