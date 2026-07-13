# Reservation

## Purpose

Fluxo de reserva unitária de presentes por convidadas, com validação de disponibilidade.

## Requirements

### Requirement: Reservar um presente

A aplicação SHALL permitir que a convidada reserve um presente informando: nome, email (opcional) e quantidade.

A reserva SHALL ser enviada via fetch() POST para o Apps Script Web App, que valida e salva no Google Sheets.

#### Scenario: Reserva bem-sucedida

- **WHEN** a convidada informa nome "Maria", presenteId 1, quantidade 2
- **AND** clica em "Confirmar"
- **THEN** uma requisição POST é enviada para o Apps Script com action='reservar'
- **AND** o Apps Script valida, insere na planilha e atualiza estoque
- **AND** o frontend recebe {success: true} e exibe toast de confirmação

#### Scenario: Reserva com erro

- **WHEN** a reserva não pode ser processada (estoque insuficiente, dados inválidos)
- **THEN** o Apps Script retorna {success: false, message: '...'}
- **AND** o frontend exibe toast de erro com a mensagem

#### Scenario: Reserva acima do limite

- **WHEN** a convidada informa quantidade 5
- **AND** o presente possui restante = 2
- **THEN** a reserva NÃO é confirmada
- **AND** uma mensagem de erro é exibida informando a disponibilidade

### Requirement: Validar dados de entrada

A aplicação SHALL validar que o nome não está vazio e que a quantidade é maior que zero.

#### Scenario: Nome obrigatório

- **WHEN** o campo nome está vazio
- **THEN** a reserva NÃO é confirmada
- **AND** uma mensagem de erro é exibida

#### Scenario: Quantidade inválida

- **WHEN** a quantidade informada é 0 ou negativa
- **THEN** a reserva NÃO é confirmada
- **AND** uma mensagem de erro é exibida

### Requirement: Confirmar reserva ao convidada

A aplicação SHALL exibir uma confirmação após reserva bem-sucedida, informando o presente reservado e a quantidade.

#### Scenario: Confirmação exibida

- **WHEN** a reserva é confirmada com sucesso
- **THEN** a aplicação exibe uma mensagem de confirmação com nome do presente e quantidade

### Requirement: Atualizar disponibilidade automaticamente

Após uma reserva confirmada, a aplicação SHALL atualizar o campo `reservado` do presente na planilha.

#### Scenario: Atualização pós-reserva

- **WHEN** uma reserva de quantidade 2 é confirmada para presenteId 1
- **THEN** o campo `reservado` do presente 1 é incrementado em 2

### Requirement: Modal de reserva

O modal de reserva SHALL ser exibido em tela cheia no mobile, com botões de tamanho adequado para toque.

#### Scenario: Abrir modal

- **WHEN** a convidada clica em "Reservar" em um gift card
- **THEN** o modal abre em tela cheia (100% width e height)
- **AND** os campos de input têm mínimo 44px de altura
- **AND** o botão "Confirmar" está fixo no rodapé

#### Scenario: Fechar modal

- **WHEN** a convidada clica em "Cancelar" ou fora do modal
- **THEN** o modal fecha
- **AND** os dados do formulário são limpos

### Requirement: Cancelar reserva

A aplicação SHALL permitir o cancelamento de reservas ativas via fetch() POST.

#### Scenario: Cancelar reserva (admin)

- **WHEN** o admin clica em "Cancelar" em uma reserva
- **THEN** uma requisição POST é enviada com action='cancelar' e id da reserva
- **AND** o Apps Script atualiza status para 'cancelada'
- **AND** o frontend atualiza a lista de reservas
