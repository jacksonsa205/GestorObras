
# GestãoObras

## Descrição
GestãoObras é uma aplicação para gerenciamento de obras, desenvolvida com Node.js no backend e React no frontend. Este projeto visa facilitar o acompanhamento e controle de projetos de construção, oferecendo funcionalidades como cadastro de obras, monitoramento de progresso, e relatórios detalhados.

## Tecnologias Utilizadas

### Backend:
- **Node.js**
- **Express**
- **Banco de Dados:** (O banco de dados esta na plataforma de backend Supabase, onde tambem utilizo a autenticação.)

### Frontend:
- **React**
- **CSS Puro**

### Outras ferramentas:
- **Git** para controle de versão
- **Postman** para testes de APIs
- **Docker** (opcional, se usado para containerização)

## Estrutura do Projeto

### Backend:
- **backend/src**: Código-fonte principal
- **backend/controller**: Controladores de requisições
- **backend/models**: Modelos de banco de dados
- **backend/routes**: Definição de rotas

### Frontend:
- **frontend/src**: Código-fonte principal
- **frontend/pages**: Páginas da aplicação
- **frontend/components**: Componentes reutilizáveis
- **frontend/assets**: Imagens e outros arquivos estáticos
- **frontend/public**: Arquivos públicos

## Funcionalidades
- Cadastro de obras com informações detalhadas
- Listagem e filtragem de obras
- Relatórios de progresso
- Gerenciamento de usuários

## Instalação

### Pré-requisitos:
- Node.js instalado
- Gerenciador de pacotes npm ou yarn
- Banco de dados configurado (especifique o banco usado)

### Passos:
1. Clone o repositório:
   ```bash
   git clone https://github.com/jacksonsa205/gestao-obras.git
   ```

2. Navegue para o diretório do backend e instale as dependências:
   ```bash
   cd backend
   npm install
   ```

3. Configure as variáveis de ambiente no arquivo `.env`:
   ```env
   DB_HOST=localhost
   DB_USER=usuario
   DB_PASS=senha
   DB_NAME=gestao_obras
   ```

4. Inicie o servidor backend:
   ```bash
   npm start
   ```

5. Navegue para o diretório do frontend e instale as dependências:
   ```bash
   cd ../frontend
   npm install
   ```

6. Inicie o servidor frontend:
   ```bash
   npm start
   ```

## Uso
1. Acesse o frontend no navegador em `http://localhost:3000`.
2. Utilize a aplicação para cadastrar e gerenciar obras.

## Contribuição
Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests no repositório.

## Apache License 2.0
Copyright 2024 Jackson Alves de Sá

Licenciado sob a Licença Apache, Versão 2.0 (a "Licença"); você não pode usar este arquivo exceto em conformidade com a Licença. 
Você pode obter uma cópia da Licença em:

    http://www.apache.org/licenses/LICENSE-2.0

A menos que exigido por lei aplicável ou acordado por escrito, o software distribuído sob a Licença é distribuído "COMO ESTÁ", 
SEM GARANTIAS OU CONDIÇÕES DE QUALQUER TIPO, expressas ou implícitas. Veja a Licença para o idioma específico que rege as permissões e limitações sob a Licença.

---


