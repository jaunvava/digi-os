package com.sistemaos.service;

import com.sistemaos.domain.dto.ServicoCreateDTO;
import com.sistemaos.domain.dto.ServicoDTO;
import com.sistemaos.domain.entity.Servico;
import com.sistemaos.repository.ServicoRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ServicoService {

    private final ServicoRepository servicoRepository;

    public ServicoService(ServicoRepository servicoRepository) {
        this.servicoRepository = servicoRepository;
    }

    @Transactional(readOnly = true)
    public List<ServicoDTO> findAll() {
        return servicoRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ServicoDTO findById(Long id) {
        return servicoRepository.findById(id)
                .map(this::toDTO)
                .orElseThrow(() -> new EntityNotFoundException("Serviço não encontrado"));
    }

    @Transactional
    public ServicoDTO create(ServicoCreateDTO dto) {
        Servico servico = new Servico();
        BeanUtils.copyProperties(dto, servico);
        servico = servicoRepository.save(servico);
        return toDTO(servico);
    }

    @Transactional
    public ServicoDTO update(Long id, ServicoCreateDTO dto) {
        Servico servico = servicoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Serviço não encontrado"));
        
        BeanUtils.copyProperties(dto, servico);
        servico = servicoRepository.save(servico);
        return toDTO(servico);
    }

    @Transactional
    public void delete(Long id) {
        if (!servicoRepository.existsById(id)) {
            throw new EntityNotFoundException("Serviço não encontrado");
        }
        servicoRepository.deleteById(id);
    }

    private ServicoDTO toDTO(Servico servico) {
        return new ServicoDTO(
                servico.getId(),
                servico.getNome(),
                servico.getDescricao(),
                servico.getValor(),
                servico.getTempoEstimado()
        );
    }
} 