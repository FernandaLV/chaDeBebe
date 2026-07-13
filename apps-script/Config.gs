var Config = {
  SPREADSHEET_ID: '1R4v3aB_lhRJgeUu4H05mHxqfvQcKI3aAobjNCaxytIc',

  SHEETS: {
    PRESENTES: 'Presentes',
    RESERVAS: 'Reservas',
    CONFIG: 'Config'
  },

  COL: {
    PRESENTES: {
      ID: 'id',
      CATEGORIA: 'categoria',
      ICONE: 'icon',
      ORDEM: 'ordem',
      ITEM: 'item',
      VALOR_SUGERIDO: 'valor',
      MAXIMO: 'máximo',
      RESERVADO: 'reservado',
      ATIVO: 'ativo'
    },
    RESERVAS: {
      ID: 'id',
      DATA_HORA: 'dataHora',
      NOME: 'nome',
      EMAIL: 'email',
      PRESENTE_ID: 'presenteId',
      QUANTIDADE: 'quantidade',
      TIPO: 'tipo',
      STATUS: 'status',
      OBSERVACOES: 'observacoes'
    }
  },

  DEFAULTS: {
    nomeBebe: 'Lista de Presentes',
    dataCha: '',
    mensagemBoasVindas: 'Chá de Bebê',
    mensagemConfirmacao: 'Reserva confirmada!',
    corTema: '#ff9a9e',
    corTexto: '#ffffff',
    mostrarValores: true,
    mostrarQuantidadeRestante: true,
    textoExplicacaoHtml: ''
  },

  getConfig: function(chave) {
    var sheet = SheetRepository.getSheet(Config.SHEETS.CONFIG);
    if (!sheet) return null;
    var lastRow = sheet.getLastRow();
    if (lastRow < 2) return null;
    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (String(data[i][0]).trim() === String(chave).trim()) {
        return data[i][1];
      }
    }
    return null;
  },

  getAllConfig: function() {
    var result = {};
    var sheet = SheetRepository.getSheet(Config.SHEETS.CONFIG);
    if (!sheet) {
      Logger.log('CONFIG: aba Config não encontrada');
      return result;
    }
    var lastRow = sheet.getLastRow();
    Logger.log('CONFIG: aba encontrada, lastRow=' + lastRow);
    if (lastRow < 2) {
      Logger.log('CONFIG: aba vazia (só cabeçalho ou sem dados)');
      return result;
    }
    var data = sheet.getDataRange().getValues();
    Logger.log('CONFIG: total de linhas=' + data.length);
    for (var i = 0; i < data.length; i++) {
      Logger.log('CONFIG: linha ' + i + ' → ["' + data[i][0] + '", "' + data[i][1] + '"]');
    }
    for (var i = 1; i < data.length; i++) {
      var chave = String(data[i][0]).trim();
      if (chave) {
        result[chave] = data[i][1];
        Logger.log('CONFIG: salvo → ' + chave + ' = ' + data[i][1]);
      }
    }
    return result;
  }
};
