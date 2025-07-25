package com.sistemaos.service;

import com.sistemaos.domain.dto.ClienteCreateDTO;
import com.sistemaos.domain.dto.ClienteDTO;
import com.sistemaos.domain.dto.ClienteUpdateDTO;
import com.sistemaos.domain.entity.Cliente;
import com.sistemaos.repository.ClienteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClienteService {
    
    private final ClienteRepository clienteRepository;
    
    public List<ClienteDTO> findAll() {
        return clienteRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public ClienteDTO findById(Long id) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));
        return convertToDTO(cliente);
    }
    
    public ClienteDTO create(ClienteCreateDTO dto) {
        if (clienteRepository.existsByDocumento(dto.getDocumento())) {
            throw new RuntimeException("Já existe um cliente com este documento");
        }
        
        Cliente cliente = new Cliente();
        cliente.setDocumento(dto.getDocumento());
        cliente.setNome(dto.getNome());
        cliente.setContato(dto.getContato());
        cliente.setEndereco(dto.getEndereco());
        
        Cliente savedCliente = clienteRepository.save(cliente);
        return convertToDTO(savedCliente);
    }
    
    public ClienteDTO update(Long id, ClienteUpdateDTO dto) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));
        
        if (dto.getDocumento() != null && !dto.getDocumento().equals(cliente.getDocumento())) {
            if (clienteRepository.existsByDocumento(dto.getDocumento())) {
                throw new RuntimeException("Já existe um cliente com este documento");
            }
            cliente.setDocumento(dto.getDocumento());
        }
        
        if (dto.getNome() != null) {
            cliente.setNome(dto.getNome());
        }
        
        if (dto.getContato() != null) {
            cliente.setContato(dto.getContato());
        }
        
        if (dto.getEndereco() != null) {
            cliente.setEndereco(dto.getEndereco());
        }
        
        Cliente updatedCliente = clienteRepository.save(cliente);
        return convertToDTO(updatedCliente);
    }
    
    public void delete(Long id) {
        if (!clienteRepository.existsById(id)) {
            throw new RuntimeException("Cliente não encontrado");
        }
        clienteRepository.deleteById(id);
    }
    
    private ClienteDTO convertToDTO(Cliente cliente) {
        return new ClienteDTO(
                cliente.getId(),
                cliente.getDocumento(),
                cliente.getNome(),
                cliente.getContato(),
                cliente.getEndereco(),
                cliente.getCreatedAt(),
                cliente.getUpdatedAt()
        );
    }
} 