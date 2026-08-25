# Arquitetura do Sistema

## Visão Geral

O sistema é composto por dois componentes principais:
- **Frontend:** Aplicação web estática hospedada no GitHub Pages
- **Backend:** API REST implementada no Google Apps Script

## Diagrama de Arquitetura

```
┌─────────────────────────────────────────────────────────────────┐
│                    FLUXO DE DADOS                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  📱 USUÁRIO                                                    │
│     │                                                           │
│     ▼                                                           │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  GITHUB PAGES                                            │   │
│  │  https://fernandalv.github.io/chaDeBebe/                │   │
│  │                                                         │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐             │   │
│  │  │  config  │  │   app    │  │  index   │             │   │
│  │  │  .js     │→ │   .js    │  │  .html   │             │   │
│  │  └──────────┘  └──────────┘  └──────────┘             │   │
│  │       │              │                                  │   │
│  │       │              ▼                                  │   │
│  │       │        ┌──────────┐                             │   │
│  │       └───────→│  api.js  │                             │   │
│  │                └────┬─────┘                             │   │
│  └─────────────────────│───────────────────────────────────┘   │
│                        │                                        │
│              fetch()   │   JSON                                 │
│                        ▼                                        │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  APPS SCRIPT WEB APP                                     │   │
│  │  https://script.google.com/macros/s/XXX/exec            │   │
│  │                                                         │   │
│  │  ┌──────────────────────────────────────────────────┐  │   │
│  │  │  Code.gs                                         │  │   │
│  │  │  ├── doGet(e)  → action= listar/pesquisar/config │  │   │
│  │  │  └── doPost(e) → action= reservar/cancelar       │  │   │
│  │  └──────────────────────────────────────────────────┘  │   │
│  │                         │                               │   │
│  │                         ▼                               │   │
│  │  ┌──────────────────────────────────────────────────┐  │   │
│  │  │  Services                                        │  │   │
│  │  │  ├── PresenteService  (CRUD presentes)           │  │   │
│  │  │  └── ReservaService   (CRUD reservas)            │  │   │
│  │  └──────────────────────────────────────────────────┘  │   │
│  │                         │                               │   │
│  │                         ▼                               │   │
│  │  ┌──────────────────────────────────────────────────┐  │   │
│  │  │  SheetRepository   (acesso à planilha)           │  │   │
│  │  └──────────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────│───────────────────────┘   │
│                                    │                            │
│                                    ▼                            │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  GOOGLE SHEETS                                          │   │
│  │  ├── aba "Presentes"  (id, categoria, item, valor...)  │   │
│  │  ├── aba "Reservas"   (id, nome, presenteId, status)   │   │
│  │  └── aba "Config"     (chave, valor)                   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Componentes

### Frontend (GitHub Pages)

| Arquivo | Responsabilidade |
|---------|------------------|
| `index.html` | Estrutura HTML da página |
| `css/style.css` | Estilos mobile-first |
| `js/config.js` | Configuração (gerado por GitHub Actions) |
| `js/api.js` | Comunicação com o backend |
| `js/app.js` | Lógica da aplicação |

### Backend (Google Apps Script)

| Arquivo | Responsabilidade |
|---------|------------------|
| `Code.gs` | Handler HTTP (doGet/doPost) |
| `Config.gs` | Configurações e constantes |
| `PresenteService.gs` | Lógica de presentes |
| `ReservaService.gs` | Lógica de reservas |
| `SheetRepository.gs` | Acesso à planilha |
| `Utils.gs` | Funções utilitárias |
| `Validation.gs` | Validações |

## Fluxos Principais

### Listar Presentes

```
1. Usuário abre a página
2. index.html carrega config.js → APP_CONFIG.GOOGLE_SCRIPT_ID disponível
3. index.html carrega api.js → API_URL montada com o ID
4. app.js chama apiObterConfig()
5. app.js chama apiListarPresentes()
6. api.js faz GET ?action=listar
7. Code.gs recebe, chama PresenteService.listarAtivos()
8. Retorna JSON com lista de presentes
9. app.js renderiza os cards
```

### Reservar Presente

```
1. Usuário clica "Reservar" em um card
2. Modal abre com formulário
3. Usuário preenche dados e clica "Confirmar"
4. app.js chama apiReservarPresente(dados)
5. api.js faz POST com {action: 'reservar', ...dados}
6. Code.gs recebe, chama ReservaService.reservar()
7. ReservaService valida, insere na planilha, atualiza estoque
8. Retorna {success: true/false}
9. app.js exibe toast e recarrega lista
```

## CI/CD e Gestão de Secrets

### GitHub Actions Workflow

O deploy é automatizado via `.github/workflows/deploy.yml`:

1. **Trigger:** Push na branch `master` ou manual
2. **Build:** Gera `lista/js/config.js` com o `GOOGLE_SCRIPT_ID` do secret
3. **Deploy:** Publica no GitHub Pages

### Gestão do GOOGLE_SCRIPT_ID

O ID de implantação do Apps Script é gerenciado como **GitHub Secret**:

- **Repository Secret:** `GOOGLE_SCRIPT_ID`
- **Valor:** Trecho da URL após `/s/` e antes de `/exec`
- **Atualização:** Settings → Secrets → Edit no secret → Update

O arquivo `config.js` **não é commitado** no repositório (está no `.gitignore`). Ele é gerado a cada build pelo workflow.

### Desenvolvimento Local

Para testar localmente, crie manualmente `lista/js/config.js`:

```js
var APP_CONFIG = {
  GOOGLE_SCRIPT_ID: 'SEU_ID_AQUI'
};
```

## Segurança

- Backend deployado como "Execute as: Me" + "Anyone"
- CORS habilitado automaticamente pelo Apps Script
- Sem autenticação no frontend (app público)
- Admin mantido no Apps Script (protegido pelo Google)
- `GOOGLE_SCRIPT_ID` armazenado em GitHub Secrets (não exposto no código)
