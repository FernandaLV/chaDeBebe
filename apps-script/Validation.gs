var Validation = {
  validarReserva: function(data) {
    if (!data) return 'Dados não informados';

    if (!data.nome || String(data.nome).trim() === '') {
      return 'Nome é obrigatório';
    }

    if (!data.presenteId) {
      return 'Presente não informado';
    }

    var quantidade = parseInt(data.quantidade, 10);
    if (isNaN(quantidade) || quantidade <= 0) {
      return 'Quantidade deve ser maior que zero';
    }

    return null;
  },

  validarId: function(id) {
    if (!id) return 'ID não informado';
    var num = parseInt(id, 10);
    if (isNaN(num) || num <= 0) return 'ID inválido';
    return null;
  }
};
