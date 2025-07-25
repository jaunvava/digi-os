-- Inserção de usuários
INSERT INTO usuarios (nome, email, senha, tipo, telefone) VALUES
('Fernando Silva', 'fernando@sistemaos.com', '$2a$10$3Qrx0RvIXCB7t6uoYkoDUOKrGA85Kj7xKipFVM.1DAA69R5TlyMDy', 'ADMIN', '(11) 99999-9999'),
('João Pedro', 'joao.pedro@sistemaos.com', '$2a$10$3Qrx0RvIXCB7t6uoYkoDUOKrGA85Kj7xKipFVM.1DAA69R5TlyMDy', 'OPERADOR', '(11) 98888-8888');

-- Inserção de produtos
INSERT INTO produtos (nome, descricao, preco, quantidade_estoque, unidade_medida, categoria, data_cadastro, data_atualizacao) VALUES
('Placa Mãe ASUS Prime', 'Placa mãe ATX Socket LGA 1200', 799.90, 15, 'UN', 'Hardware', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Memória RAM DDR4', 'Memória RAM 8GB DDR4 3200MHz', 249.90, 30, 'UN', 'Hardware', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('SSD Kingston', 'SSD 480GB SATA III', 299.90, 25, 'UN', 'Hardware', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Processador Intel i5', 'Processador Intel Core i5 10400F', 899.90, 10, 'UN', 'Hardware', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Fonte EVGA', 'Fonte 600W 80 Plus', 399.90, 20, 'UN', 'Hardware', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Pasta Térmica', 'Pasta térmica de alta performance', 29.90, 50, 'UN', 'Acessórios', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Kit Ferramentas', 'Kit de ferramentas para manutenção', 149.90, 15, 'UN', 'Ferramentas', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Álcool Isopropílico', 'Álcool isopropílico 500ml', 34.90, 40, 'UN', 'Limpeza', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Ar Comprimido', 'Spray de ar comprimido 300ml', 24.90, 35, 'UN', 'Limpeza', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Pulseira Antiestática', 'Pulseira antiestática profissional', 39.90, 25, 'UN', 'Acessórios', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Multímetro Digital', 'Multímetro digital profissional', 199.90, 10, 'UN', 'Ferramentas', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Chaves Philips', 'Kit chaves philips precisão', 59.90, 20, 'UN', 'Ferramentas', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Organizador Cabos', 'Kit organizador de cabos', 19.90, 45, 'UN', 'Acessórios', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Limpa Contatos', 'Spray limpa contatos 300ml', 29.90, 30, 'UN', 'Limpeza', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Pincel Antiestático', 'Pincel para limpeza antiestático', 14.90, 40, 'UN', 'Limpeza', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Inserção de ordens de serviço
INSERT INTO ordem_servico (numero, nome_cliente, documento_cliente, telefone_cliente, endereco_cliente, responsavel_id, data_abertura, data_fechamento, status, descricao_problema, solucao, valor_total, equipamento) VALUES
('OS001', 'Maria Silva', '123.456.789-00', '(11) 97777-7777', 'Rua A, 123', 1, CURRENT_TIMESTAMP - INTERVAL '10 days', CURRENT_TIMESTAMP - INTERVAL '8 days', 'CONCLUIDA', 'Computador não liga', 'Fonte queimada, foi substituída', 499.90, 'Computador Desktop Dell'),
('OS002', 'João Santos', '987.654.321-00', '(11) 96666-6666', 'Rua B, 456', 2, CURRENT_TIMESTAMP - INTERVAL '9 days', CURRENT_TIMESTAMP - INTERVAL '7 days', 'CONCLUIDA', 'Tela piscando', 'Atualização de drivers de vídeo', 99.90, 'Notebook HP Pavilion'),
('OS003', 'Pedro Oliveira', '456.789.123-00', '(11) 95555-5555', 'Rua C, 789', 1, CURRENT_TIMESTAMP - INTERVAL '8 days', CURRENT_TIMESTAMP - INTERVAL '6 days', 'CONCLUIDA', 'Computador lento', 'Limpeza e troca de pasta térmica', 149.90, 'Computador Desktop Lenovo'),
('OS004', 'Ana Costa', '789.123.456-00', '(11) 94444-4444', 'Rua D, 321', 2, CURRENT_TIMESTAMP - INTERVAL '7 days', CURRENT_TIMESTAMP - INTERVAL '5 days', 'CONCLUIDA', 'Não reconhece HD', 'Substituição do cabo SATA', 39.90, 'Computador Desktop Acer'),
('OS005', 'Carlos Souza', '321.654.987-00', '(11) 93333-3333', 'Rua E, 654', 1, CURRENT_TIMESTAMP - INTERVAL '6 days', NULL, 'EM_ANDAMENTO', 'Barulho ao ligar', 'Em análise', 0.00, 'Notebook Dell Inspiron'),
('OS006', 'Fernanda Lima', '654.987.321-00', '(11) 92222-2222', 'Rua F, 987', 2, CURRENT_TIMESTAMP - INTERVAL '5 days', NULL, 'EM_ANDAMENTO', 'Não liga monitor', 'Aguardando peça', 0.00, 'Monitor LG 24"'),
('OS007', 'Ricardo Santos', '147.258.369-00', '(11) 91111-1111', 'Rua G, 147', 1, CURRENT_TIMESTAMP - INTERVAL '4 days', NULL, 'AGUARDANDO_APROVACAO', 'Teclado com teclas travadas', 'Necessário trocar teclado', 0.00, 'Notebook Samsung'),
('OS008', 'Patricia Ferreira', '369.258.147-00', '(11) 90000-0000', 'Rua H, 258', 2, CURRENT_TIMESTAMP - INTERVAL '3 days', NULL, 'AGUARDANDO_PECA', 'Sem áudio', 'Placa de som com defeito', 0.00, 'Computador Desktop Positivo'),
('OS009', 'Gabriel Silva', '258.369.147-00', '(11) 89999-9999', 'Rua I, 369', 1, CURRENT_TIMESTAMP - INTERVAL '2 days', NULL, 'ABERTA', 'Computador reiniciando', 'Análise inicial realizada', 0.00, 'Notebook Acer Aspire'),
('OS010', 'Mariana Costa', '741.852.963-00', '(11) 88888-8888', 'Rua J, 741', 2, CURRENT_TIMESTAMP - INTERVAL '1 day', NULL, 'ABERTA', 'Falha ao iniciar Windows', 'Em diagnóstico', 0.00, 'Computador Desktop HP');

-- Inserção de equipamentos usados
INSERT INTO equipamento_usado (ordem_servico_id, produto_id, quantidade, valor_unitario, valor_total) VALUES
(1, 5, 1, 399.90, 399.90),  -- Fonte EVGA para OS001
(1, 6, 1, 29.90, 29.90),    -- Pasta Térmica para OS001
(2, 8, 1, 34.90, 34.90),    -- Álcool Isopropílico para OS002
(3, 6, 1, 29.90, 29.90),    -- Pasta Térmica para OS003
(3, 9, 2, 24.90, 49.80);    -- Ar Comprimido para OS003

-- Criar tabela de clientes
CREATE TABLE IF NOT EXISTS clientes (
    id BIGSERIAL PRIMARY KEY,
    documento VARCHAR(18) NOT NULL UNIQUE,
    nome VARCHAR(255) NOT NULL,
    contato VARCHAR(15) NOT NULL,
    endereco TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Inserir alguns clientes iniciais
INSERT INTO clientes (documento, nome, contato, endereco) VALUES
('123.456.789-00', 'Maria Silva', '(11) 97777-7777', 'Rua A, 123 - São Paulo, SP'),
('987.654.321-00', 'João Santos', '(11) 96666-6666', 'Rua B, 456 - São Paulo, SP'),
('456.789.123-00', 'Pedro Oliveira', '(11) 95555-5555', 'Rua C, 789 - São Paulo, SP'),
('789.123.456-00', 'Ana Costa', '(11) 94444-4444', 'Rua D, 321 - São Paulo, SP'),
('321.654.987-00', 'Carlos Souza', '(11) 93333-3333', 'Rua E, 654 - São Paulo, SP'),
('654.987.321-00', 'Fernanda Lima', '(11) 92222-2222', 'Rua F, 987 - São Paulo, SP'),
('147.258.369-00', 'Ricardo Santos', '(11) 91111-1111', 'Rua G, 147 - São Paulo, SP'),
('369.258.147-00', 'Patricia Ferreira', '(11) 90000-0000', 'Rua H, 258 - São Paulo, SP'),
('258.369.147-00', 'Gabriel Silva', '(11) 89999-9999', 'Rua I, 369 - São Paulo, SP'),
('741.852.963-00', 'Mariana Costa', '(11) 88888-8888', 'Rua J, 741 - São Paulo, SP');

-- Criar tabela de serviços
CREATE TABLE IF NOT EXISTS servicos (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    tempo_estimado INT NOT NULL
);

-- Inserir alguns serviços iniciais
INSERT INTO servicos (nome, descricao, valor, tempo_estimado) VALUES
    ('Formatação de Computador', 'Formatação completa do sistema operacional com backup dos dados', 150.00, 120),
    ('Limpeza de Notebook', 'Limpeza física completa com troca de pasta térmica', 120.00, 60),
    ('Instalação de Software', 'Instalação e configuração de programas específicos', 50.00, 30),
    ('Reparo de Hardware', 'Diagnóstico e reparo de componentes com defeito', 200.00, 180); 