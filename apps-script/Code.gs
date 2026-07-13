function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) ? e.parameter.action : 'listar';

  switch (action) {
    case 'listar':
      return jsonResponse(PresenteService.listarAtivos());
    case 'pesquisar':
      return jsonResponse(PresenteService.pesquisar(e.parameter.q));
    case 'config':
      return jsonResponse(obterConfigFrontend());
    case 'estatisticas':
      return jsonResponse(ReservaService.estatisticas());
    default:
      return jsonResponse({ error: 'Ação inválida' });
  }
}

function doPost(e) {
  var data = JSON.parse(e.postData.contents);
  var action = data.action;

  switch (action) {
    case 'reservar':
      return jsonResponse(ReservaService.reservar(data));
    case 'cancelar':
      return jsonResponse(ReservaService.cancelar(data.id));
    default:
      return jsonResponse({ error: 'Ação inválida' });
  }
}

function listarPresentes() {
  return PresenteService.listarAtivos();
}

function pesquisarPresentes(termo) {
  return PresenteService.pesquisar(termo);
}

function listarPresentesPorCategoria() {
  return PresenteService.listarPorCategoria();
}

function reservarPresente(dados) {
  return ReservaService.reservar(dados);
}

function cancelarReserva(reservaId) {
  return ReservaService.cancelar(reservaId);
}

function listarReservas() {
  return ReservaService.listarTodas();
}

function obterEstatisticas() {
  return ReservaService.estatisticas();
}

function obterConfig(chave) {
  return Config.getConfig(chave);
}

function obterConfigFrontend() {
  var defaults = Config.DEFAULTS;
  var cfg = Config.getAllConfig();
  Logger.log('CONFIG FRONTEND: cfg=' + JSON.stringify(cfg));

  function val(chave, defaultVal) {
    var v = cfg[chave];
    if (v === undefined || v === null || v === '') return defaultVal;
    return v;
  }

  var result = {
    nomeBebe: String(val('nomeBebe', defaults.nomeBebe)),
    dataCha: val('dataCha', defaults.dataCha) ? String(val('dataCha', defaults.dataCha)) : '',
    mensagemBoasVindas: String(val('mensagemBoasVindas', defaults.mensagemBoasVindas)),
    mensagemConfirmacao: String(val('mensagemConfirmacao', defaults.mensagemConfirmacao)),
    corTema: String(val('corTema', defaults.corTema)),
    corTexto: String(val('corTexto', defaults.corTexto)),
    mostrarValores: cfg.mostrarValores !== false && cfg.mostrarValores !== 'FALSE',
    mostrarQuantidadeRestante: cfg.mostrarQuantidadeRestante !== false && cfg.mostrarQuantidadeRestante !== 'FALSE',
    textoExplicacaoHtml: String(val('textoExplicacaoHtml', defaults.textoExplicacaoHtml))
  };
  Logger.log('CONFIG FRONTEND: resultado=' + JSON.stringify(result));
  return result;
}
