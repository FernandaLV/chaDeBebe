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
│  │  https://usuario.github.io/chaDeBebe/                   │   │
│  │                                                         │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐             │   │
│  │  │  index   │  │  style   │  │   app    │             │   │
│  │  │  .html   │→ │  .css    │  │   .js    │             │   │
│  │  └──────────┘  └──────────┘  └────┬─────┘             │   │
│  │                                    │                    │   │
│  │                                    ▼                    │   │
│  │                              ┌──────────┐              │   │
│  │                              │  api.js  │              │   │
│  │                              └────┬─────┘              │   │
│  └─────────────────────────────────│───────────────────────┘   │
│                                    │                            │
│                          fetch()   │   JSON                     │
│                                    ▼                            │
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
2. app.js chama apiObterConfig()
3. app.js chama apiListarPresentes()
4. api.js faz GET ?action=listar
5. Code.gs recebe, chama PresenteService.listarAtivos()
6. Retorna JSON com lista de presentes
7. app.js renderiza os cards
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

## Segurança

- Backend deployado como "Execute as: Me" + "Anyone"
- CORS habilitado automaticamente pelo Apps Script
- Sem autenticação no frontend (app público)
- Admin mantido no Apps Script (protegido pelo Google)
