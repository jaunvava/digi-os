package com.sistemaos.repository;

import com.sistemaos.domain.entity.OrdemServico;
import com.sistemaos.domain.entity.Usuario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrdemServicoRepository extends JpaRepository<OrdemServico, Long> {
    Page<OrdemServico> findByResponsavel(Usuario responsavel, Pageable pageable);
    
    @Query("SELECT o FROM OrdemServico o WHERE o.dataAbertura BETWEEN :inicio AND :fim")
    List<OrdemServico> findByPeriodo(@Param("inicio") LocalDateTime inicio, @Param("fim") LocalDateTime fim);
    
    @Query("SELECT o FROM OrdemServico o WHERE o.status = 'CONCLUIDA' AND o.dataFechamento BETWEEN :inicio AND :fim")
    List<OrdemServico> findConcluidasByPeriodo(LocalDateTime inicio, LocalDateTime fim);
} 