# 🔥 FireCards - Portal Administrativo de Gestão de Cartas

## 📋 Sobre o Projeto

O FireCards foi desenvolvido como solução a um desafio técnico full stack, seguindo restrições estritas de arquitetura limpa sem frameworks (sem React, Vue, Angular, Bootstrap ou Tailwind). Todo o ecossistema frontend é construído em HTML5, CSS3 e JavaScript Vanilla puros, integrados a um backend nativo em PHP com PDO e banco de dados MySQL, o que garante total controle de DOM, performance otimizada e ausência de dependências externas complexas.

## ✨ Funcionalidades Principais

- **Autenticação Segura**: Sistema de login e cadastro protegido por sessões PHP e criptografia de senhas (`password_hash` / `password_verify`).
- **CRUD Completo**: Inclusão, listagem, edição detalhada e exclusão de cartas.
- **Filtros Dinâmicos Cruzados**:
  - **Abas Superiores**: Filtro rápido por Card Game (Todos, Magic, Yu-Gi-Oh!, Pokémon).
  - **Barra Lateral (Sidebar)**: Carregamento assíncrono de checkboxes de edições específicas baseadas no jogo selecionado.
  - **Barra de Pesquisa Instantânea**: Filtro em tempo real por texto digitado (busca simultânea no nome em inglês ou português).
- **Pré-visualização Dinâmica**: Modal interativo com carregamento em tempo real do preview da imagem da carta na proporção vertical ideal (300x420).
- **Identidade Visual Temática**: Design exclusivo baseado em um esquema de cores "Fire/Orange" com layout responsivo em grid.

## 🛠️ Tecnologias Utilizadas

- **Backend**: PHP 8.2 com servidor Apache e extensão PDO MySQL.
- **Banco de Dados**: MySQL 8.0 com inicialização automática de schema via script SQL.
- **Frontend**: HTML5 semântico, CSS3 customizado com variáveis globais (`:root`) e JavaScript Vanilla (Modular e assíncrono via Fetch API).
- **Infraestrutura**: Docker e Docker Compose para containerização e portabilidade total do ambiente.

## 📁 Estrutura de Diretórios do Projeto


/firecards
├── docker-compose.yml       # Orquestração dos containers (Web + DB)
├── Dockerfile                # Configuração do ambiente PHP 8.2 + Apache + PDO
├── init.sql                  # Script de criação de tabelas e massa de dados inicial
└── src/                       # Raiz pública do servidor web
    ├── index.html             # Tela de Login e Cadastro
    ├── dashboard.html         # Painel Administrativo Principal
    ├── assets/
    |   ├──documents
    |   |   design_cardgame.pdf
    |   |    Processo Seletivo.pdf
    │   └── img/
    │       └── Logo.png       # Logotipo oficial do sistema
    ├── api/                   # Endpoints do Backend (PHP)
    │   ├── db.php             # Conexão centralizada PDO
    │   ├── login.php          # Autenticação de usuários
    │   ├── register.php       # Cadastro de novos usuários
    │   ├── logout.php         # Encerramento de sessão
    │   ├── get_cards.php      # Listagem de todas as cartas
    │   ├── get_card.php       # Consulta de carta unitária por ID
    │   ├── save_card.php      # Inclusão e Edição (Upsert) de cartas
    │   ├── delete_card.php    # Exclusão de cartas
    │   └── editions.php       # Retorno dinâmico de edições por jogo
    ├── css/
    │   └── style.css          # Folha de estilos global unificada
    └── js/
        ├── auth.js             # Lógica de controle do formulário de login/registro
        └── cards.js            # Lógica do CRUD, filtros, modais e eventos DOM


## 🚀 Como Inicializar o Projeto com Docker

1. Certifique-se de ter o Docker e o Docker Compose instalados em sua máquina.
2. Clone o repositório ou descompacte a pasta do projeto em sua máquina.
3. Abra o terminal na pasta raiz do projeto (`/firecards`).
4. Execute o comando para construir e iniciar os containers em segundo plano:

   bash
   docker-compose up -d --build
   

   O container do banco de dados executará o script `init.sql` automaticamente na primeira inicialização, criando o schema e inserindo um usuário padrão.

5. Acesse o sistema através do seu navegador no endereço:

   👉 http://localhost:8080

## 🔑 Credenciais de Acesso (Teste)

Para testar o painel administrativo imediatamente após subir os containers, utilize as credenciais padrão pré-cadastradas:

| Campo | Valor |
|---|---|
| E-mail | `admin@firecards.com` |
| Senha | `password` |

## 💡 Decisões de Arquitetura, UX e Produto

**Bloqueio Progressivo do Formulário (UX)**
O campo de seleção de "Edição" dentro do modal permanece desabilitado até que o operador escolha um "Card Game", exibindo um estado de carregamento (loading) assíncrono durante a requisição à API. Essa decisão linear previne o envio de dados corrompidos ou inconsistências relacionais na base de dados.

**Modais Contextuais Sem Recarga (UI)**
As operações de criação e edição ocorrem em um modal flutuante sobreposto à listagem. Isso preserva o escopo de visualização do usuário, mantendo os filtros laterais e o termo de pesquisa ativos mesmo após salvar ou atualizar uma carta.

**Gerenciamento de Estado em Memória**
O frontend armazena a listagem total de cartas em memória (`let allCards = []`), permitindo que a aplicação realize o cruzamento simultâneo entre abas de jogos, marcações de edições na barra lateral e o campo de busca textual de forma instantânea, sem requisições desnecessárias ao servidor.

## 🔮 Roadmap / Melhorias Futuras (Propostas)

- **Exclusão Lógica e Lixeira (Soft Delete)**: Implementação de uma coluna `deleted_at` no banco de dados para mover cartas excluídas para uma lixeira temporária com retenção de até 30 dias antes da purga definitiva.
- **Operações em Lote (Bulk Actions)**: Adição de seleção múltipla por checkboxes no grid para deletar ou alterar categorias de várias cartas simultaneamente.

## 📄 Licença

Este projeto foi desenvolvido sob os termos da licença MIT para fins de avaliação técnica.