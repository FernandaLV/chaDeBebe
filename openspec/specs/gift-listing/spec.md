# Gift Listing

## Purpose

Exibição dos presentes agrupados por categoria, com pesquisa e quantidade restante.

## Requirements

### Requirement: Exibir lista de presentes

A aplicação SHALL exibir todos os presentes com `ativo = TRUE` cadastrados na aba Presentes.

Cada presente SHALL exibir: ícone, nome, faixa de valor sugerido, quantidade restante e botão "Reservar".

O frontend SHALL ser servido via GitHub Pages com HTML/CSS/JS puro, sem dependência de iframes do Google Apps Script.

#### Scenario: Listar presentes ativos

- **WHEN** a convidada acessa a página principal no GitHub Pages
- **THEN** a aplicação busca presentes via fetch() para o Apps Script Web App
- **AND** exibe todos os presentes onde `ativo = TRUE`, ordenados por `categoria` e `ordem`

#### Scenario: Ocultar presentes inativos

- **WHEN** um presente possui `ativo = FALSE`
- **THEN** o presente NÃO aparece na listagem

#### Scenario: Layout responsivo mobile

- **WHEN** a convidada acessa em dispositivo com tela ≤768px
- **THEN** os gift cards são exibidos em layout vertical (empilhados)
- **AND** o botão "Reservar" ocupa largura total
- **AND** todos os elementos interativos têm mínimo 44px de altura

#### Scenario: Layout desktop

- **WHEN** a convidada acessa em dispositivo com tela >768px
- **THEN** os gift cards são exibidos em layout horizontal
- **AND** o layout se adapta ao tamanho da tela

### Requirement: Agrupar presentes por categoria

A aplicação SHALL agrupar os presentes por campo `categoria`, exibindo o nome da categoria como cabeçalho de seção.

#### Scenario: Exibir categorias

- **WHEN** a listagem é exibida
- **THEN** os presentes estão agrupados sob cabeçalhos de categoria (ex: Higiene, Banho, Alimentação)

### Requirement: Pesquisar presentes

A aplicação SHALL permitir pesquisar presentes pelo campo `item` (nome).

A filtragem SHALL ocorrer via requisição fetch() ao Apps Script, sem recarregar a página.

#### Scenario: Pesquisa por nome

- **WHEN** a convidada digita "toalha" no campo de pesquisa
- **THEN** uma requisição fetch() é enviada com action=pesquisar&q=toalha
- **AND** apenas presentes cujo campo `item` contém "toalha" são exibidos

#### Scenario: Pesquisa vazia

- **WHEN** o campo de pesquisa está vazio
- **THEN** todos os presentes ativos são exibidos

### Requirement: Exibir quantidade restante

A aplicação SHALL calcular e exibir a quantidade restante de cada presente como `máximo - reservado`.

#### Scenario: Calcular restante

- **WHEN** um presente possui `máximo = 5` e `reservado = 2`
- **THEN** a quantidade exibida é `3`

#### Scenario: Esgotado

- **WHEN** um presente possui `máximo = reservado`
- **THEN** a quantidade exibida é `0` e o botão "Reservar" está desabilitado

### Requirement: Comunicação com backend

O frontend SHALL comunicar com o Apps Script via fetch() para requisições GET e POST.

#### Scenario: Requisição GET

- **WHEN** o frontend precisa listar presentes ou obter config
- **THEN** uma requisição GET é enviada para o Web App do Apps Script
- **AND** a resposta é JSON

#### Scenario: Requisição POST

- **WHEN** o frontend precisa criar ou atualizar dados (reserva, cancelamento)
- **THEN** uma requisição POST é enviada com body JSON
- **AND** a resposta é JSON com status da operação
