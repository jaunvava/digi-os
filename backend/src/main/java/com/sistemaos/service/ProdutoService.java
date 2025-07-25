package com.sistemaos.service;

import com.sistemaos.domain.dto.ProdutoCreateDTO;
import com.sistemaos.domain.dto.ProdutoDTO;
import com.sistemaos.domain.entity.Produto;
import com.sistemaos.repository.ProdutoRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProdutoService {

    private final ProdutoRepository produtoRepository;

    @Transactional(readOnly = true)
    public List<ProdutoDTO> findAll() {
        return produtoRepository.findAll()
                .stream()
                .map(ProdutoDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ProdutoDTO findById(Long id) {
        return produtoRepository.findById(id)
                .map(ProdutoDTO::fromEntity)
                .orElseThrow(() -> new EntityNotFoundException("Produto não encontrado"));
    }

    @Transactional
    public ProdutoDTO create(ProdutoCreateDTO dto) {
        Produto produto = new Produto();
        produto.setNome(dto.getNome());
        produto.setDescricao(dto.getDescricao());
        produto.setPreco(dto.getPreco());
        produto.setQuantidadeEstoque(dto.getQuantidadeEstoque());
        produto.setUnidadeMedida(dto.getUnidadeMedida());
        produto.setCategoria(dto.getCategoria());

        produto = produtoRepository.save(produto);
        return ProdutoDTO.fromEntity(produto);
    }

    @Transactional
    public ProdutoDTO update(Long id, ProdutoCreateDTO dto) {
        Produto produto = produtoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Produto não encontrado"));

        produto.setNome(dto.getNome());
        produto.setDescricao(dto.getDescricao());
        produto.setPreco(dto.getPreco());
        produto.setQuantidadeEstoque(dto.getQuantidadeEstoque());
        produto.setUnidadeMedida(dto.getUnidadeMedida());
        produto.setCategoria(dto.getCategoria());

        produto = produtoRepository.save(produto);
        return ProdutoDTO.fromEntity(produto);
    }

    @Transactional
    public void delete(Long id) {
        if (!produtoRepository.existsById(id)) {
            throw new EntityNotFoundException("Produto não encontrado");
        }
        produtoRepository.deleteById(id);
    }
} 