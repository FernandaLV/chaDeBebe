var PresenteService = {
  listarAtivos: function() {
    var col = Config.COL.PRESENTES;
    var presentes = SheetRepository.getAllRows(Config.SHEETS.PRESENTES);
    return presentes
      .filter(function(p) {
        var v = p[col.ATIVO];
        return v === true || v === 'TRUE' || v === 'VERDADEIRO';
      })
      .map(function(p) {
        return {
          id: p[col.ID],
          categoria: p[col.CATEGORIA],
          icone: p[col.ICONE],
          ordem: p[col.ORDEM],
          item: p[col.ITEM],
          valorSugerido: p[col.VALOR_SUGERIDO],
          maximo: p[col.MAXIMO],
          reservado: p[col.RESERVADO] || 0,
          restante: Utils.calcularRestante(p[col.MAXIMO], p[col.RESERVADO])
        };
      })
      .sort(function(a, b) {
        if (a.categoria < b.categoria) return -1;
        if (a.categoria > b.categoria) return 1;
        return a.ordem - b.ordem;
      });
  },

  buscarPorId: function(id) {
    var col = Config.COL.PRESENTES;
    var row = SheetRepository.findById(Config.SHEETS.PRESENTES, id);
    if (!row) return null;
    return {
      id: row[col.ID],
      categoria: row[col.CATEGORIA],
      icone: row[col.ICONE],
      item: row[col.ITEM],
      valorSugerido: row[col.VALOR_SUGERIDO],
      maximo: row[col.MAXIMO],
      reservado: row[col.RESERVADO] || 0,
      restante: Utils.calcularRestante(row[col.MAXIMO], row[col.RESERVADO])
    };
  },

  atualizarReservado: function(presenteId, quantidade) {
    var rowIndex = SheetRepository.findIndexById(Config.SHEETS.PRESENTES, presenteId);
    if (rowIndex === -1) return false;

    var col = Config.COL.PRESENTES;
    var presente = SheetRepository.findById(Config.SHEETS.PRESENTES, presenteId);
    var novoReservado = (presente[col.RESERVADO] || 0) + quantidade;

    SheetRepository.updateRow(Config.SHEETS.PRESENTES, rowIndex, {
      reservado: novoReservado
    });
    return true;
  },

  decrementarReservado: function(presenteId, quantidade) {
    var rowIndex = SheetRepository.findIndexById(Config.SHEETS.PRESENTES, presenteId);
    if (rowIndex === -1) return false;

    var col = Config.COL.PRESENTES;
    var presente = SheetRepository.findById(Config.SHEETS.PRESENTES, presenteId);
    var novoReservado = Math.max(0, (presente[col.RESERVADO] || 0) - quantidade);

    SheetRepository.updateRow(Config.SHEETS.PRESENTES, rowIndex, {
      reservado: novoReservado
    });
    return true;
  },

  listarPorCategoria: function() {
    var presentes = PresenteService.listarAtivos();
    var categorias = {};

    presentes.forEach(function(p) {
      if (!categorias[p.categoria]) {
        categorias[p.categoria] = [];
      }
      categorias[p.categoria].push(p);
    });

    return categorias;
  },

  pesquisar: function(termo) {
    if (!termo || termo.trim() === '') {
      return PresenteService.listarAtivos();
    }

    var termoLower = termo.toLowerCase();
    return PresenteService.listarAtivos().filter(function(p) {
      return p.item.toLowerCase().indexOf(termoLower) !== -1;
    });
  },

  totalPresentes: function() {
    return PresenteService.listarAtivos().length;
  },

  totalReservado: function() {
    return PresenteService.listarAtivos().reduce(function(sum, p) {
      return sum + (p.reservado || 0);
    }, 0);
  },

  totalMaximo: function() {
    return PresenteService.listarAtivos().reduce(function(sum, p) {
      return sum + (p.maximo || 0);
    }, 0);
  }
};
