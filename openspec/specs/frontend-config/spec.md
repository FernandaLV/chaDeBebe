# Frontend Config

## Purpose

Frontend totalmente configurável via aba Config da planilha.

## Requirements

### Requirement: Buscar configurações do frontend

A aplicação SHALL buscar todas as configurações do frontend em uma única chamada ao backend.

#### Scenario: Configurações carregadas com sucesso

- **WHEN** o frontend solicita as configurações
- **THEN** o backend retorna um objeto com: nomeBebe, dataCha, mensagemBoasVindas, mensagemConfirmacao, corTema, corTexto, mostrarValores, mostrarQuantidadeRestante, textoExplicacaoHtml

#### Scenario: Chave inexistente

- **WHEN** uma chave não existe na aba Config
- **THEN** o valor retornado é o default correspondente

### Requirement: Exibir título dinâmico no header

A aplicação SHALL exibir o valor de `nomeBebe` como título do header.

#### Scenario: nomeBebe configurado

- **WHEN** `nomeBebe` = "Ana"
- **THEN** o título do header exibe "Lista de Presentes da Ana"

#### Scenario: nomeBebe não configurado

- **WHEN** `nomeBebe` não existe no Config
- **THEN** o título do header exibe "Lista de Presentes"

### Requirement: Exibir subtítulo dinâmico

A aplicação SHALL exibir `mensagemBoasVindas` como subtítulo do header.

#### Scenario: mensagemBoasVindas configurada

- **WHEN** `mensagemBoasVindas` = "Ajude-nos a preparar tudo!"
- **THEN** o subtítulo exibe a mensagem configurada

#### Scenario: mensagemBoasVindas não configurada

- **WHEN** `mensagemBoasVindas` não existe no Config
- **THEN** o subtítulo exibe "Chá de Bebê"

### Requirement: Exibir data do chá

A aplicação SHALL exibir `dataCha` no header no formato DD/MM/AAAA quando configurada.

#### Scenario: dataCha configurada

- **WHEN** `dataCha` = "15/08/2026"
- **THEN** a data é exibida no header formatada como DD/MM/AAAA

#### Scenario: dataCha não configurada

- **WHEN** `dataCha` não existe no Config
- **THEN** nenhuma data é exibida

### Requirement: Aplicar cor do tema dinamicamente

A aplicação SHALL usar `corTema` para colorir header, botões, bordas e foco.

#### Scenario: corTema configurada

- **WHEN** `corTema` = "#e91e63"
- **THEN** o header usa gradiente com a cor fornecida
- **AND** os botões "Reservar" e "Confirmar" usam a cor fornecida
- **AND** as bordas das categorias usam a cor fornecida
- **AND** o foco dos inputs usa a cor fornecida

#### Scenario: corTema não configurada

- **WHEN** `corTema` não existe no Config
- **THEN** usa a cor padrão (#ff9a9e)

### Requirement: Aplicar cor do texto dinamicamente

A aplicação SHALL usar `corTexto` para colorir o texto do header e dos botões.

#### Scenario: corTexto configurada

- **WHEN** `corTexto` = "#333333"
- **THEN** o texto do header e dos botões usa a cor fornecida

#### Scenario: corTexto não configurada

- **WHEN** `corTexto` não existe no Config
- **THEN** usa a cor padrão (#ffffff)

### Requirement: Condição de exibição de preço

A aplicação SHALL exibir o preço dos presentes apenas quando `mostrarValores` = TRUE.

#### Scenario: mostrarValores = TRUE

- **WHEN** `mostrarValores` = TRUE
- **THEN** o preço é exibido em cada card

#### Scenario: mostrarValores = FALSE

- **WHEN** `mostrarValores` = FALSE
- **THEN** o preço não é exibido nos cards

### Requirement: Condição de exibição de estoque

A aplicação SHALL exibir a quantidade restante apenas quando `mostrarQuantidadeRestante` = TRUE.

#### Scenario: mostrarQuantidadeRestante = TRUE

- **WHEN** `mostrarQuantidadeRestante` = TRUE
- **THEN** o badge de estoque é exibido em cada card

#### Scenario: mostrarQuantidadeRestante = FALSE

- **WHEN** `mostrarQuantidadeRestante` = FALSE
- **THEN** o badge de estoque não é exibido nos cards

### Requirement: Mensagem de confirmação personalizada

A aplicação SHALL usar `mensagemConfirmacao` como mensagem de sucesso após reserva.

#### Scenario: mensagemConfirmacao configurada

- **WHEN** `mensagemConfirmacao` = "Obrigada, {nome}!"
- **THEN** a mensagem exibida contém o nome da convidada substituído

#### Scenario: mensagemConfirmacao não configurada

- **WHEN** `mensagemConfirmacao` não existe no Config
- **THEN** a mensagem padrão é "Reserva confirmada!"
