# 🎁 Cha de Bebe - Lista de Presentes

Aplicação web para gerenciamento de lista de presentes para chá de bebê.

**URL:** https://fernandalv.github.io/chaDeBebe/

## Arquitetura

```
┌─────────────────────────┐      ┌─────────────────────┐
│   GITHUB PAGES          │      │   APPS SCRIPT       │
│   (Frontend)            │ fetch│   (Backend API)     │
│                         │ ───→ │                     │
│  config.js (gerado)     │      │  Code.gs (API)      │
│  index.html             │ ←─── │  Services           │
│  style.css              │ JSON │  SheetRepository    │
│  app.js + api.js        │      │                     │
└─────────────────────────┘      └─────────────────────┘
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
- `config.js` gerado automaticamente pelo GitHub Actions

### Backend (Google Apps Script)
- API REST retornando JSON
- Integração com Google Sheets
- Deploy como Web App

## Estrutura do Projeto

```
chaDeBebe/
├── README.md              ← este arquivo
├── .gitignore
├── .env.example           ← template de variáveis
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
├── lista/                 ← Frontend (GitHub Pages)
│   ├── index.html
│   ├── css/style.css
│   ├── js/api.js
│   ├── js/app.js
│   ├── js/config.js       ← GERADO pelo GitHub Actions (não commitar)
│   └── img/
│
├── .github/workflows/     ← CI/CD
│   └── deploy.yml         ← Deploy automático via GitHub Actions
│
├── openspec/              ← Especificações
│
└── docs/                  ← Documentação
    └── arquitetura.md
```

## Setup

### Frontend (GitHub Pages)

1. Ativar GitHub Pages no repositório
   - Settings → Pages → Source: GitHub Actions
2. Configurar o secret `GOOGLE_SCRIPT_ID`
   - Settings → Secrets and variables → Actions → New repository secret
   - **Name:** `GOOGLE_SCRIPT_ID`
   - **Secret:** ID do deploy do Apps Script (trecho após `/s/` e antes de `/exec` na URL)
3. Fazer push para a branch `master` — o workflow gera `config.js` automaticamente

### Backend (Google Apps Script)

1. Copiar arquivos de `apps-script/` para o editor do Apps Script
2. Configurar ID da planilha em `Config.gs`
3. Deploy como Web App
   - Execute as: Me
   - Who has access: Anyone
4. Copiar o ID do deploy e adicionar como secret no GitHub

## Desenvolvimento

### Frontend (local)

Para testar localmente, crie `lista/js/config.js` manualmente:

```js
var APP_CONFIG = {
  GOOGLE_SCRIPT_ID: 'SEU_ID_AQUI'
};
```

```bash
cd lista
python -m http.server 8000
# Acessar http://localhost:8000
```

### Backend

Usar o editor do Google Apps Script.

## Deploy

### Frontend
- Automático via GitHub Actions (push na branch `master`)
- Workflow gera `config.js` com o secret `GOOGLE_SCRIPT_ID`
- URL: https://fernandalv.github.io/chaDeBebe/

### Backend
1. Abrir editor do Apps Script
2. Deploy → Manage deployments → Edit → Nova versão
3. Copiar novo ID
4. Atualizar o secret `GOOGLE_SCRIPT_ID` no GitHub
   - Settings → Secrets and variables → Actions → Edit no secret

## Atualizar GOOGLE_SCRIPT_ID

Ao criar uma nova implantação do Apps Script:

1. Copie o novo ID da URL (trecho após `/s/` e antes de `/exec`)
2. Vá em **Settings > Secrets and variables > Actions**
3. Clique em **Edit** no secret `GOOGLE_SCRIPT_ID`
4. Cole o novo valor e clique em **Update secret**
5. Reexecute o workflow ou faça um push

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
- **CI/CD:** GitHub Actions
