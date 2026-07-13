var ReservaService = {
  reservar: function(data) {
    var erro = Validation.validarReserva(data);
    if (erro) {
      return { success: false, message: erro };
    }

    var presente = PresenteService.buscarPorId(data.presenteId);
    if (!presente) {
      return { success: false, message: 'Presente não encontrado' };
    }

    var quantidade = parseInt(data.quantidade, 10);
    if (presente.restante < quantidade) {
      return {
        success: false,
        message: 'Disponibilidade insuficiente. Restam apenas ' + presente.restante + ' unidades.'
      };
    }

    var reserva = {
      id: SheetRepository.getNextId(Config.SHEETS.RESERVAS),
      dataHora: Utils.agora(),
      nome: data.nome.trim(),
      email: (data.email || '').trim(),
      presenteId: parseInt(data.presenteId, 10),
      quantidade: quantidade,
      tipo: data.tipo || 'compra',
      status: 'ativa',
      observacoes: ''
    };

    Logger.log('RESERVA: dados recebidos → tipo=' + data.tipo);
    Logger.log('RESERVA: objeto reserva → ' + JSON.stringify(reserva));

    var headers = SheetRepository.getSheet(Config.SHEETS.RESERVAS).getDataRange().getValues()[0];
    Logger.log('RESERVAS: cabeçalhos da aba → ' + JSON.stringify(headers));

    SheetRepository.insertRow(Config.SHEETS.RESERVAS, reserva);
    PresenteService.atualizarReservado(data.presenteId, quantidade);

    return {
      success: true,
      message: 'Reserva confirmada!',
      reserva: {
        id: reserva.id,
        presente: presente.item,
        quantidade: quantidade
      }
    };
  },

  cancelar: function(reservaId) {
    var reserva = SheetRepository.findById(Config.SHEETS.RESERVAS, reservaId);
    if (!reserva) {
      return { success: false, message: 'Reserva não encontrada' };
    }

    if (reserva.status === 'cancelada') {
      return { success: false, message: 'Reserva já está cancelada' };
    }

    var rowIndex = SheetRepository.findIndexById(Config.SHEETS.RESERVAS, reservaId);
    SheetRepository.updateRow(Config.SHEETS.RESERVAS, rowIndex, {
      status: 'cancelada'
    });

    PresenteService.decrementarReservado(reserva.presenteId, reserva.quantidade);

    return { success: true, message: 'Reserva cancelada com sucesso' };
  },

  listarTodas: function() {
    var reservas = SheetRepository.getAllRows(Config.SHEETS.RESERVAS);
    Logger.log('RESERVAS LISTA: total=' + reservas.length);
    if (reservas.length > 0) {
      Logger.log('RESERVAS LISTA: primeira reserva → ' + JSON.stringify(reservas[0]));
    }
    return reservas
      .map(function(r) {
        var presente = PresenteService.buscarPorId(r.presenteId);
        var tipo = String(r.tipo || '').trim().toLowerCase();
        Logger.log('RESERVA: id=' + r.id + ' tipo raw="' + r.tipo + '" tipo normalizado="' + tipo + '"');
        return {
          id: r.id,
          dataHora: r.dataHora,
          nome: r.nome,
          presente: presente ? presente.item : 'Desconhecido',
          quantidade: r.quantidade,
          tipo: tipo || 'compra',
          status: r.status
        };
      })
      .sort(function(a, b) {
        return new Date(b.dataHora) - new Date(a.dataHora);
      });
  },

  totalAtivas: function() {
    return SheetRepository.getAllRows(Config.SHEETS.RESERVAS)
      .filter(function(r) { return r.status === 'ativa'; })
      .reduce(function(sum, r) { return sum + (r.quantidade || 0); }, 0);
  },

  percentualReservado: function() {
    var maximo = PresenteService.totalMaximo();
    if (maximo === 0) return 0;
    return Math.round((ReservaService.totalAtivas() / maximo) * 100);
  },

  estatisticas: function() {
    return {
      totalPresentes: PresenteService.totalPresentes(),
      totalReservado: ReservaService.totalAtivas(),
      percentualReservado: ReservaService.percentualReservado()
    };
  }
};
