package com.sistemaos.controller;

import com.sistemaos.domain.dto.LoginDTO;
import com.sistemaos.domain.dto.TokenDTO;
import com.sistemaos.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:3002"})
@Tag(name = "Autenticação", description = "Endpoints para autenticação de usuários")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    @Operation(summary = "Realizar login", description = "Autentica um usuário e retorna um token JWT")
    public ResponseEntity<?> login(@RequestBody LoginDTO loginDTO) {
        log.info("Recebida requisição de login. Dados recebidos: {}", loginDTO);
        
        // Validação dos campos
        Map<String, String> errors = new HashMap<>();
        
        if (loginDTO == null) {
            log.error("LoginDTO é nulo");
            errors.put("message", "Dados de login não fornecidos");
            return ResponseEntity.badRequest().body(errors);
        }
        
        if (loginDTO.getEmail() == null || loginDTO.getEmail().trim().isEmpty()) {
            log.error("Email não fornecido");
            errors.put("email", "Email é obrigatório");
        }
        
        if (loginDTO.getSenha() == null || loginDTO.getSenha().trim().isEmpty()) {
            log.error("Senha não fornecida");
            errors.put("senha", "Senha é obrigatória");
        }
        
        if (!errors.isEmpty()) {
            log.error("Erros de validação: {}", errors);
            return ResponseEntity.badRequest().body(errors);
        }
        
        try {
            TokenDTO tokenDTO = authService.autenticar(loginDTO);
            log.info("Login realizado com sucesso para o email: {}", loginDTO.getEmail());
            return ResponseEntity.ok(tokenDTO);
        } catch (BadCredentialsException e) {
            log.error("Credenciais inválidas para o email: {}", loginDTO.getEmail());
            Map<String, String> error = new HashMap<>();
            error.put("message", "Email ou senha inválidos");
            return ResponseEntity.status(401).body(error);
        } catch (Exception e) {
            log.error("Erro ao realizar login para o email: {}. Erro: {}", loginDTO.getEmail(), e.getMessage(), e);
            Map<String, String> error = new HashMap<>();
            error.put("message", "Erro ao realizar login: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
} 