# 🎁 Cha de Bebe - Lista de Presentes

Aplicação web para gerenciamento de lista de presentes para chá de bebê.

## Arquitetura

```
┌─────────────────────┐      ┌─────────────────────┐
│   GITHUB PAGES      │      │   APPS SCRIPT       │
│   (Frontend)        │ fetch│   (Backend API)     │
│                     │ ───→ │                     │
│  index.html         │      │  Code.gs (API)      │
│  style.css          │ ←─── │  Services           │
│  app.js + api.js    │ JSON │  SheetRepository    │
└─────────────────────┘      └─────────────────────┘
                                      │
                                      ▼
                             ┌─────────────────┐
                             │ Google Sheets   │
                             │ (banco de dados)│
                             └─────────────────┘
```

### Frontend (GitHub Pages)
- HTML/CSS/JS puro
- Layout mobile-first responsivo
- Comunicação via `fetch()` com o backend

### Backend (Google Apps Script)
- API REST retornando JSON
- Integração com Google Sheets
- Deploy como Web App

## Estrutura do Projeto

```
chaDeBebe/
├── README.md              ← este arquivo
├── .gitignore
│
├── apps-script/           ← Backend (copiar para Apps Script)
│   ├── Code.gs
│   ├── Config.gs
│   ├── PresenteService.gs
│   ├── ReservaService.gs
│   ├── SheetRepository.gs
│   ├── Utils.gs
│   └── Validation.gs
│
├── frontend/              ← Frontend (GitHub Pages)
│   ├── index.html
│   ├── css/style.css
│   ├── js/api.js
│   ├── js/app.js
│   └── img/
│
├── openspec/              ← Especificações
│
└── docs/                  ← Documentação
    └── arquitetura.md
```

## Setup

### Frontend (GitHub Pages)

1. Ativar GitHub Pages no repositório
   - Settings → Pages → Source: main branch
2. Configurar URL do Web App em `frontend/js/api.js`
   - Substituir `SEU_ID_AQUI` pelo ID do Web App

### Backend (Google Apps Script)

1. Copiar arquivos de `apps-script/` para o editor do Apps Script
2. Configurar ID da planilha em `Config.gs`
3. Deploy como Web App
   - Execute as: Me
   - Who has access: Anyone
4. Copiar a URL do Web App para `frontend/js/api.js`

## Desenvolvimento

### Frontend (local)

```bash
cd frontend
python -m http.server 8000
# Acessar http://localhost:8000
```

### Backend

Usar o editor do Google Apps Script.

## Deploy

### Frontend
- Automático via GitHub Pages (push na branch main)

### Backend
1. Abrir editor do Apps Script
2. Deploy → Manage deployments → Edit → Nova versão
3. Copiar nova URL
4. Atualizar em `frontend/js/api.js`

## API Endpoints

### GET

| Ação | Parâmetros | Descrição |
|------|------------|-----------|
| `listar` | - | Lista presentes ativos |
| `pesquisar` | `q` | Pesquisa presentes por nome |
| `config` | - | Retorna configuração |
| `estatisticas` | - | Retorna estatísticas |

### POST

| Ação | Body | Descrição |
|------|------|-----------|
| `reservar` | `{nome, presenteId, quantidade, tipo}` | Cria reserva |
| `cancelar` | `{id}` | Cancela reserva |

## Tecnologias

- **Frontend:** HTML5, CSS3, JavaScript ES6+
- **Backend:** Google Apps Script (JavaScript)
- **Banco:** Google Sheets
- **Hospedagem:** GitHub Pages + Google Apps Script
