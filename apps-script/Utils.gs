var Utils = {
  gerarId: function() {
    return Utilities.getUuid();
  },

  agora: function() {
    return new Date().toISOString();
  },

  formatarValor: function(valor) {
    if (!valor) return '';
    return 'R$ ' + valor.toFixed(2).replace('.', ',');
  },

  calcularRestante: function(maximo, reservado) {
    return Math.max(0, (maximo || 0) - (reservado || 0));
  },

  parseJson: function(e) {
    try {
      return JSON.parse(e.postData.contents);
    } catch (err) {
      return null;
    }
  },

  jsonResponse: function(obj) {
    return ContentService.createTextOutput(JSON.stringify(obj))
      .setMimeType(ContentService.MimeType.JSON);
  }
};
