# Admin Dashboard

## Purpose

Painel administrativo com estatísticas, listagem de reservas e cancelamento.

## Requirements

### Requirement: Exibir estatísticas gerais

A aplicação SHALL exibir no painel administrativo: total de presentes, total reservado e percentual reservado.

#### Scenario: Calcular estatísticas

- **WHEN** o administrador acessa admin.html
- **THEN** a aplicação exibe: total de presentes ativos, total de itens reservados, percentual reservado

### Requirement: Listar reservas

A aplicação SHALL exibir as reservas realizadas, ordenadas por data/hora decrescente.

Cada reserva SHALL exibir: data/hora, nome, presente, quantidade e status.

#### Scenario: Exibir reservas

- **WHEN** o administrador acessa admin.html
- **THEN** a lista de reservas é exibida com as mais recentes primeiro

### Requirement: Cancelar reserva

A aplicação SHALL permitir cancelar uma reserva existente.

Ao cancelar, o campo `reservado` do presente associado SHALL ser decrementado pela quantidade da reserva.

#### Scenario: Cancelamento bem-sucedido

- **WHEN** o administrador cancela a reserva de id 5 (presenteId 1, quantidade 2)
- **THEN** o status da reserva é alterado para "cancelada"
- **AND** o campo `reservado` do presente 1 é decrementado em 2

#### Scenario: Reserva já cancelada

- **WHEN** o administrador tenta cancelar uma reserva com status "cancelada"
- **THEN** a operação NÃO é realizada
- **AND** uma mensagem informativa é exibida
