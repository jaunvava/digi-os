package com.sistemaos.service;

import com.sistemaos.repository.UsuarioRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;

    public CustomUserDetailsService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        log.info("Tentando carregar usuário com email: {}", username);
        
        return usuarioRepository.findByEmail(username)
                .map(user -> {
                    log.info("Usuário encontrado: {}", user.getEmail());
                    return user;
                })
                .orElseThrow(() -> {
                    log.error("Usuário não encontrado com email: {}", username);
                    return new UsernameNotFoundException("Usuário não encontrado");
                });
    }
} 