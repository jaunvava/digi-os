# Sistema de Gerenciamento de Ordens de Serviço

Sistema completo para gerenciamento de Ordens de Serviço (OS) para uma empresa de serviços de informática.

## Tecnologias Utilizadas

### Backend

- Java 17
- Spring Boot 3.2.3
- Spring Security com JWT
- Spring Data JPA
- PostgreSQL
- iText 7 para geração de PDF
- Swagger/OpenAPI para documentação

### Frontend (em desenvolvimento)

- Next.js
- TypeScript
- TailwindCSS
- Context API

## Funcionalidades

- Autenticação e autorização com JWT
- Gerenciamento de usuários (ADMIN/CLIENTE)
- CRUD completo de Ordens de Serviço
- Gestão de itens de serviço
- Geração de PDF das OS
- Relatórios por período
- Documentação da API com Swagger

## Configuração do Ambiente

1. Requisitos:

   - Java 17
   - Maven
   - Docker e Docker Compose
   - Node.js e npm (para o frontend)

2. Clone o repositório:

   ```bash
   git clone <url-do-repositorio>
   cd sistema-os
   ```

3. Inicie o banco de dados:

   ```bash
   docker-compose up -d
   ```

4. Execute o backend:

   ```bash
   mvn spring-boot:run
   ```

5. Acesse a documentação da API:
   ```
   http://localhost:8080/swagger-ui.html
   ```

## Endpoints da API

### Autenticação

- POST /api/auth/registrar - Registro de novo usuário
- POST /api/auth/login - Login de usuário

### Ordens de Serviço

- GET /api/ordens-servico - Lista todas as OS (ADMIN)
- POST /api/ordens-servico - Cria nova OS
- GET /api/ordens-servico/{id} - Busca OS por ID
- PUT /api/ordens-servico/{id} - Atualiza OS (ADMIN)
- DELETE /api/ordens-servico/{id} - Remove OS (ADMIN)
- GET /api/ordens-servico/{id}/pdf - Gera PDF da OS
- GET /api/ordens-servico/cliente/{clienteId} - Lista OS por cliente
- GET /api/ordens-servico/periodo - Lista OS por período (ADMIN)

### Itens de Serviço

- POST /api/ordens-servico/{id}/itens - Adiciona item à OS (ADMIN)
- DELETE /api/ordens-servico/{id}/itens - Remove item da OS (ADMIN)

## Usuário Administrador Padrão

- Administrador: fernando@sistemaos.com / 123456
- Operador: joao.pedro@sistemaos.com / 123456

## Segurança

- Todas as senhas são armazenadas com hash BCrypt
- Autenticação stateless com JWT
- Controle de acesso baseado em roles (ADMIN/CLIENTE)
- CORS configurado para desenvolvimento local

## Próximos Passos

1. Implementação do frontend com Next.js
2. Melhorias no layout do PDF
3. Implementação de testes automatizados
4. Configuração de CI/CD
5. Documentação detalhada do código

## 📦 Pré-requisitos

- Java 21
- Node.js 18+
- PostgreSQL 15+
- Docker e Docker Compose (opcional)

## 🛠️ Instalação

### Backend

1. Clone o repositório

```bash
git clone [url-do-repositorio]
cd sistema-os/backend
```

2. Configure o banco de dados PostgreSQL

```bash
# Se estiver usando Docker
docker-compose up -d postgres
```
3. build o backend

```bash
mvn clean package

```

4. Execute o backend

```bash
mvn spring-boot:run
```

### Frontend

1. Entre na pasta do frontend

```bash
cd frontend
```

2. Instale as dependências

```bash
npm install
```

3. Execute o frontend

```bash
npm run dev
```

## 📚 Documentação

- A documentação da API está disponível em `http://localhost:8080/swagger-ui.html`
- Documentação técnica completa na pasta `/docs`

## 👥 Usuários do Sistema

### Administrador

- Gerenciamento completo de OS
- Dashboard administrativo
- Geração de relatórios
- Impressão de OS em PDF

### Cliente

- Visualização de OS
- Acompanhamento de status
- Histórico de serviços

## 🤝 Contribuição

1. Faça o fork do projeto
2. Crie sua feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT.
