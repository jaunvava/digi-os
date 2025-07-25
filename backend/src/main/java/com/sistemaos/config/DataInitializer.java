package com.sistemaos.config;

import com.sistemaos.domain.entity.Usuario;
import com.sistemaos.repository.UsuarioRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Slf4j
@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            log.info("Iniciando a criação dos usuários iniciais...");
            
            if (usuarioRepository.count() == 0) {
                log.info("Banco de dados vazio, criando usuários padrão...");
                
                // Criar usuário admin Fernando
                Usuario admin = Usuario.builder()
                    .nome("Fernando")
                    .email("fernando@sistemaos.com")
                    .senha(passwordEncoder.encode("123456"))
                    .tipo(Usuario.TipoUsuario.ADMIN)
                    .telefone("(11) 88888-8888")
                    .build();
                admin = usuarioRepository.save(admin);
                log.info("Usuário admin criado com sucesso: {}", admin.getEmail());

                // Criar usuário operador João Pedro
                Usuario operador = Usuario.builder()
                    .nome("João Pedro")
                    .email("joao.pedro@sistemaos.com")
                    .senha(passwordEncoder.encode("123456"))
                    .tipo(Usuario.TipoUsuario.OPERADOR)
                    .telefone("(11) 99999-9999")
                    .build();
                operador = usuarioRepository.save(operador);
                log.info("Usuário operador criado com sucesso: {}", operador.getEmail());
                
                log.info("Usuários padrão criados com sucesso!");
            } else {
                log.info("Banco de dados já possui usuários, pulando criação...");
            }
        };
    }

    @Bean
    public CommandLineRunner initData(PasswordEncoder passwordEncoder, UsuarioRepository usuarioRepository) {
        return args -> {
            String senha = "123456";
            String senhaHash = passwordEncoder.encode(senha);
            log.info("Nova senha hasheada para teste: {}", senhaHash);
            
            // Busca o usuário do banco
            usuarioRepository.findByEmail("fernando@sistemaos.com").ifPresent(usuario -> {
                log.info("Hash atual da senha no banco: {}", usuario.getSenha());
                boolean senhaCorreta = passwordEncoder.matches(senha, usuario.getSenha());
                log.info("A senha '{}' corresponde ao hash do banco? {}", senha, senhaCorreta);
                
                if (!senhaCorreta) {
                    // Atualiza a senha do usuário
                    usuario.setSenha(senhaHash);
                    usuarioRepository.save(usuario);
                    log.info("Senha atualizada no banco para o hash: {}", senhaHash);
                }
            });
        };
    }
} 