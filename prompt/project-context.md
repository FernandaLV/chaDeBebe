# Proposta: Sistema Web para Lista de Presentes de Chá de Bebê

## Contexto

Desenvolver uma aplicação web utilizando **Google Apps Script** e **Google Sheets** para gerenciamento de uma lista de presentes de chá de bebê.

O objetivo é substituir listas compartilhadas ou formulários tradicionais por uma aplicação web simples, responsiva e fácil de utilizar em qualquer navegador, principalmente em celulares, sem exigir instalação de aplicativos ou login.

A aplicação será utilizada inicialmente para um chá de bebê, mas deverá ser desenvolvida de forma genérica para permitir reutilização em eventos futuros.

---

# Objetivos

O sistema deverá permitir que convidadas:

* visualizem a lista de presentes disponível;
* pesquisem presentes;
* visualizem a quantidade restante de cada item;
* reservem um ou mais presentes;
* recebam confirmação da reserva.

Também deverá existir uma área administrativa para:

* acompanhar reservas;
* visualizar estatísticas;
* cancelar reservas;
* atualizar automaticamente os quantitativos disponíveis.

---

# Tecnologias

Backend

* Google Apps Script

Persistência

* Google Sheets

Frontend

* HTML
* CSS
* JavaScript (ES6)

Hospedagem

* Web App do Google Apps Script

---

# Requisitos Funcionais

## RF01 - Listagem de presentes

A aplicação deverá exibir todos os presentes ativos cadastrados na planilha.

Cada presente deverá apresentar:

* ícone
* nome
* descrição (quando existir)
* faixa de valor sugerido
* quantidade restante
* botão Reservar

---

## RF02 - Agrupamento

Os presentes deverão ser agrupados por categoria.

Exemplo:

* Higiene
* Banho
* Alimentação
* Roupas
* Organização
* Farmácia

---

## RF03 - Pesquisa

Permitir pesquisar presentes pelo nome.

A filtragem deverá ocorrer sem recarregar a página.

---

## RF04 - Reserva

O usuário deverá informar:

* nome
* um ou mais presentes
* quantidade de cada presente

Antes de concluir a reserva, o sistema deverá validar disponibilidade.

---

## RF05 - Atualização automática

Após uma reserva:

* atualizar a planilha;
* atualizar os quantitativos;
* impedir novas reservas acima do limite.

---

## RF06 - Administração

Disponibilizar uma página administrativa contendo:

* total de presentes;
* total reservado;
* percentual reservado;
* últimas reservas;
* possibilidade de cancelar reservas.

---

# Requisitos Não Funcionais

* Interface responsiva (mobile-first)
* Não exigir instalação de aplicativo
* Não exigir login para convidados
* Código organizado e modular
* Separação entre frontend e backend
* Fácil manutenção
* Fácil reutilização

---

# Estrutura da Planilha

## Aba Presentes

Campos:

* id
* categoria
* ícone
* ordem
* item
* descrição
* valor sugerido
* imagem
* máximo
* reservado
* restante
* ativo

---

## Aba Reservas

Campos:

* id
* dataHora
* nome
* email
* presenteId
* quantidade
* status
* observações

---

## Aba Config

Campos chave/valor para configurações da aplicação.

---

# Arquitetura

Organizar o projeto em múltiplos arquivos.

Exemplo:

```
Code.gs

Config.gs

PresenteService.gs

ReservaService.gs

SheetRepository.gs

Utils.gs

Views.gs

Validation.gs

index.html

admin.html

css.html

javascript.html
```

Cada arquivo deve possuir responsabilidade única.

Evitar concentrar toda a lógica em um único arquivo Code.gs.

---

# Princípios de Desenvolvimento

Aplicar boas práticas de engenharia de software:

* Single Responsibility Principle
* Separation of Concerns
* Clean Code
* Nomes claros
* Baixo acoplamento
* Alta coesão

O código deve ser organizado para permitir evolução futura.

---

# Escopo Inicial

Esta proposta contempla apenas:

* definição da arquitetura;
* definição das responsabilidades dos módulos;
* definição do modelo de dados;
* definição das páginas;
* definição dos fluxos da aplicação.

A implementação será realizada em propostas subsequentes.

---

# Possíveis Evoluções Futuras

O projeto deverá permitir adicionar futuramente:

* autenticação para administradores;
* upload de imagens dos presentes;
* confirmação por e-mail;
* QR Code para acesso à lista;
* painel com gráficos;
* exportação em PDF;
* lista de presentes reutilizável para outros eventos;
* tema configurável pela planilha;
* internacionalização;
* integração com serviços externos.
