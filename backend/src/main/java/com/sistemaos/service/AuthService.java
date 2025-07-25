package com.sistemaos.service;

import com.sistemaos.domain.dto.LoginDTO;
import com.sistemaos.domain.dto.TokenDTO;
import com.sistemaos.domain.entity.Usuario;
import com.sistemaos.repository.UsuarioRepository;
import com.sistemaos.security.JwtUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class AuthService {

    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(JwtUtil jwtUtil, AuthenticationManager authenticationManager, 
                      UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public TokenDTO autenticar(LoginDTO loginDTO) {
        log.info("Iniciando processo de autenticação para o email: {}", loginDTO.getEmail());
        
        try {
            // Verifica se o usuário existe
            Usuario usuarioExistente = usuarioRepository.findByEmail(loginDTO.getEmail())
                .orElseThrow(() -> {
                    log.error("Usuário não encontrado para o email: {}", loginDTO.getEmail());
                    return new UsernameNotFoundException("Usuário não encontrado");
                });
            
            log.info("Usuário encontrado, verificando senha...");
            
            // Verifica a senha manualmente primeiro para debug
            boolean senhaCorreta = passwordEncoder.matches(loginDTO.getSenha(), usuarioExistente.getSenha());
            log.info("Senha está correta? {}", senhaCorreta);
            
            try {
                // Tenta autenticar
                Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginDTO.getEmail(), loginDTO.getSenha())
                );
                
                log.info("Autenticação bem-sucedida para o email: {}", loginDTO.getEmail());

                Usuario usuario = (Usuario) authentication.getPrincipal();
                String token = jwtUtil.generateToken(usuario);
                
                log.info("Token gerado com sucesso para o usuário: {}", usuario.getEmail());

                return TokenDTO.builder()
                    .token(token)
                    .tipo("Bearer")
                    .nome(usuario.getNome())
                    .email(usuario.getEmail())
                    .tipoUsuario(usuario.getTipo())
                    .id(usuario.getId())
                    .avatar(usuario.getAvatar())
                    .build();
            } catch (BadCredentialsException e) {
                log.error("Falha na autenticação para o email: {}. Senha incorreta.", loginDTO.getEmail());
                throw new BadCredentialsException("Email ou senha incorretos");
            }
        } catch (UsernameNotFoundException e) {
            log.error("Usuário não encontrado: {}", loginDTO.getEmail());
            throw new BadCredentialsException("Email ou senha incorretos");
        } catch (Exception e) {
            log.error("Erro durante a autenticação para o email: {}. Erro: {}", loginDTO.getEmail(), e.getMessage());
            throw new RuntimeException("Erro durante a autenticação: " + e.getMessage());
        }
    }
} 