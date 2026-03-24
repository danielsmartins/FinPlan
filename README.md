# 📊 FINPLAN - Planejador Financeiro

 ![License](https://img.shields.io/badge/license-MIT-blue.svg) ![PNPM](https://img.shields.io/badge/pnpm-10.x-orange.svg) ![React](https://img.shields.io/badge/React-19-blue.svg?logo=react) ![Node.js](https://img.shields.io/badge/Node.js-20.x-green.svg?logo=node.js)

FINPLAN é uma aplicação full-stack de planejamento financeiro, desenvolvida utilizando uma arquitetura de monorepo com PNPM Workspaces. O projeto é dividido em uma API robusta (`api`) e uma interface web moderna e interativa (`web`).

---

## 📋 Índice

- [Visão Geral do Projeto](#-visão-geral-do-projeto)
- [✨ Features](#-features)
- [🛠️ Stack de Tecnologias](#️-stack-de-tecnologias)
- [🔩 Estrutura do Monorepo](#-estrutura-do-monorepo)
- [⚙️ Pré-requisitos](#️-pré-requisitos)
- [🚀 Instalação e Execução Local](#-instalação-e-execução-local)
- [📜 Scripts Disponíveis](#-scripts-disponíveis)
- [📄 Licença](#-licença)

---

## 📖 Visão Geral do Projeto

O objetivo do FINPLAN é ajudar os usuarios a controlar suas finanças, seus gastos, seus ganhos, fazendo com que tenham uma visão geral e também detalhada de suas finanças.

-   **`apps/api`**: O backend do projeto. Uma API RESTful construída com Node.js e Express, responsável por toda a lógica de negócio, autenticação de usuários e comunicação com o banco de dados via Prisma.
-   **`apps/web`**: O frontend do projeto. Uma Single Page Application (SPA) construída com React e Vite, que consome a API para fornecer uma experiência de usuário rica e responsiva.

---

## ✨ Features

-   **Autenticação Segura**: Sistema completo de registro e login com senhas criptografadas (`Bcryptjs`) e tokens de sessão (`JWT`).
-   **Validação Robusta**: Validação de todos os dados de entrada na API com `Zod` para garantir a integridade dos dados.
-   **Interface Moderna**: UI construída com React e estilizada com **Tailwind CSS**, utilizando componentes de UI da Headless UI e ícones da Lucide React.
-   **Visualização de Dados**: Gráficos e dashboards interativos para análise financeira, construídos com `Recharts`.
-   **Arquitetura Monorepo**: Gerenciamento centralizado de dependências e scripts com **PNPM Workspaces**, facilitando o desenvolvimento e a manutenção.
-   **Ambiente de Desenvolvimento Simplificado**: Scripts orquestrados com `concurrently` para iniciar todo o ambiente com um único comando.

---

## 🛠️ Stack de Tecnologias

### Monorepo
| Ferramenta | Descrição |
|---|---|
| **PNPM** | Gerenciador de pacotes rápido e eficiente em disco, com suporte a Workspaces. |
| **Concurrently** | Ferramenta para executar múltiplos comandos em paralelo. |

### Backend (`apps/api`)
| Ferramenta | Descrição |
|---|---|
| **Node.js** | Ambiente de execução JavaScript no servidor. |
| **Express** | Framework web minimalista para a construção da API. |
| **Prisma** | ORM de próxima geração para interagir com o banco de dados. |
| **Zod** | Biblioteca para validação de schemas. |
| **JWT & Bcryptjs**| Para autenticação e segurança de senhas. |
| **Helmet & CORS** | Middlewares de segurança essenciais. |

### Frontend (`apps/web`)
| Ferramenta | Descrição |
|---|---|
| **React 19** | Biblioteca para construção de interfaces de usuário. |
| **Vite** | Ferramenta de build extremamente rápida para desenvolvimento frontend. |
| **React Router** | Para gerenciamento de rotas e navegação na SPA. |
| **Tailwind CSS** | Framework CSS utility-first para estilização rápida. |
| **Axios** | Cliente HTTP para realizar requisições à API. |
| **Recharts** | Biblioteca para criação de gráficos. |

---

## 🔩 Estrutura do Monorepo
```
/FINPLAN
├── apps/
│   ├── api/
│   │   ├── prisma/
│   │   ├── src/
│   │   ├── .env
│   │   └── package.json
│   └── web/
│       ├── public/
│       ├── src/
│       ├── .env
│       └── package.json
├── node_modules/
├── .gitignore
├── package.json           
├── pnpm-lock.yaml
└── pnpm-workspace.yaml
```
---

## ⚙️ Pré-requisitos

Antes de começar a desenvolver localmente, você precisará ter instalado em sua máquina:
- [Node.js (v18.x ou superior)](https://nodejs.org/en/)
- [PNPM (v10.x ou superior)](https://pnpm.io/installation)
- Um banco de dados suportado pelo Prisma (ex: PostgreSQL, MySQL, SQLite).

---

## 🚀 Instalação e Execução Local

Siga os passos abaixo para configurar e rodar o projeto completo em sua máquina:

1.  **Clone o repositório:**
    ```bash
    git clone [URL_DO_SEU_REPOSITORIO]
    cd FINPLAN
    ```

2.  **Instale todas as dependências** do monorepo com PNPM:
    ```bash
    pnpm install
    ```

3.  **Configure as variáveis de ambiente:**
    - **Para a API (`apps/api/.env`):**
      ```env
      DATABASE_URL="postgresql://user:password@localhost:5432/finplan_db"
      JWT_SECRET="SEU_SEGREDO_SUPER_SECRETO_AQUI"
      PORT=3333
      ```
    - **Para o App Web (`apps/web/.env`):**
      ```env
      VITE_API_BASE_URL=http://localhost:3333
      ```

4.  **Execute as migrações do banco de dados** da API:
    ```bash
    pnpm --filter api prisma migrate dev
    ```

5.  **Inicie os servidores de desenvolvimento** (API e Web) simultaneamente:
    ```bash
    pnpm dev
    ```

A API estará rodando em `http://localhost:3333` e o App Web em `http://localhost:5173`.

---

## 📜 Scripts Disponíveis

Todos os scripts principais podem ser executados a partir da pasta raiz do projeto.

| Comando (na raiz) | Descrição |
|---|---|
| `pnpm dev` | Inicia **ambos** os servidores (API e Web) em modo de desenvolvimento. |
| `pnpm dev:api` | Inicia **apenas** o servidor da API em modo de desenvolvimento. |
| `pnpm dev:web` | Inicia **apenas** o servidor do Web em modo de desenvolvimento. |
| `pnpm --filter api build` | Gera o cliente do Prisma para a API. |
| `pnpm --filter web build` | Compila o frontend para produção. |
| `pnpm --filter web lint` | Executa o linter no código do frontend. |

---

## 📄 Licença

Este projeto está sob a licença MIT.

---

Feito por **Daniel** (www.linkedin.com/in/daniel-silva-martins)
