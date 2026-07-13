// app.js - Lógica da aplicação

var todosPresentes = [];
var presenteSelecionado = null;
var config = {};

async function init() {
  try {
    config = await apiObterConfig();
    aplicarCorTema(config.corTema);
    aplicarCorTexto(config.corTexto);
    aplicarHeader();
    aplicarTextoExplicacao();

    const presentes = await apiListarPresentes();
    todosPresentes = presentes;
    renderizarPresentes(presentes);
  } catch (error) {
    console.error('Erro ao inicializar:', error);
    document.getElementById('giftList').innerHTML =
      '<div class="empty-state">Erro ao carregar. Tente novamente.</div>';
  }

  document.getElementById('searchInput').addEventListener('input', async function () {
    const termo = this.value.trim();
    try {
      const presentes = termo === ''
        ? await apiListarPresentes()
        : await apiPesquisarPresentes(termo);
      renderizarPresentes(presentes);
    } catch (error) {
      showToast('Erro ao pesquisar.', 'error');
    }
  });
}

function aplicarCorTema(cor) {
  if (!cor) return;
  const root = document.documentElement;
  root.style.setProperty('--cor-tema', cor);
  root.style.setProperty('--cor-tema-claro', gerarGradiente(cor));
}

function aplicarCorTexto(cor) {
  if (!cor) return;
  document.documentElement.style.setProperty('--cor-texto', cor);
}

function gerarGradiente(cor) {
  const r = parseInt(cor.substr(1, 2), 16);
  const g = parseInt(cor.substr(3, 2), 16);
  const b = parseInt(cor.substr(5, 2), 16);
  const r2 = Math.min(255, r + Math.round((255 - r) * 0.4));
  const g2 = Math.min(255, g + Math.round((255 - g) * 0.4));
  const b2 = Math.min(255, b + Math.round((255 - b) * 0.4));
  return '#' + ((1 << 24) + (r2 << 16) + (g2 << 8) + b2).toString(16).slice(1);
}

function aplicarHeader() {
  const titulo = config.nomeBebe || 'Lista de Presentes';
  const tituloFormatado = titulo.indexOf('Lista') === -1
    ? 'Lista de Presentes da ' + titulo
    : titulo;
  document.getElementById('headerTitle').textContent = '🎁 ' + tituloFormatado;

  const subtitulo = config.mensagemBoasVindas || 'Chá de Bebê';
  document.getElementById('headerSubtitle').innerHTML = subtitulo;

  const dataEl = document.getElementById('headerData');
  if (config.dataCha) {
    dataEl.textContent = 'Data do evento: ' + formatarData(config.dataCha);
    dataEl.style.display = 'block';
    dataEl.style.fontWeight = 'bold';
  } else {
    dataEl.style.display = 'none';
  }
}

function formatarData(data) {
  if (!data) return '';
  const str = String(data).trim();
  if (str.indexOf('/') !== -1) return str;
  if (str.indexOf('-') !== -1) {
    const parts = str.split('T')[0].split('-');
    if (parts.length === 3) return parts[2] + '/' + parts[1] + '/' + parts[0];
  }
  const d = new Date(data);
  if (!isNaN(d.getTime())) {
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return dd + '/' + mm + '/' + yyyy;
  }
  return str;
}

function aplicarTextoExplicacao() {
  if (config.textoExplicacaoHtml) {
    const el = document.getElementById('infoText');
    el.innerHTML = config.textoExplicacaoHtml;
    el.style.display = 'block';
  }
}

function renderizarPresentes(presentes) {
  const container = document.getElementById('giftList');

  if (!presentes || presentes.length === 0) {
    container.innerHTML = '<div class="empty-state">Nenhum presente encontrado.</div>';
    return;
  }

  const categorias = {};
  presentes.forEach(function (p) {
    if (!categorias[p.categoria]) categorias[p.categoria] = [];
    categorias[p.categoria].push(p);
  });

  let html = '';
  for (const cat in categorias) {
    html += '<div class="category">';
    html += '<div class="category-title">' + cat + '</div>';

    categorias[cat].forEach(function (p) {
      html += '<div class="gift-card">';
      html += '  <div class="gift-icon">' + (p.icone || '🎁') + '</div>';
      html += '  <div class="gift-info">';
      html += '    <div class="gift-name">' + p.item + '</div>';
      if (config.mostrarValores !== false) {
        html += '    <div class="gift-value">' + p.valorSugerido + '</div>';
      }
      html += '  </div>';
      html += '  <div class="gift-stock">';
      if (config.mostrarQuantidadeRestante !== false) {
        let stockClass = 'stock-ok';
        let stockText = p.restante + ' disponível' + (p.restante !== 1 ? 's' : '');
        if (p.restante === 0) {
          stockClass = 'stock-empty';
          stockText = 'Esgotado';
        } else if (p.restante <= 2) {
          stockClass = 'stock-low';
        }
        html += '    <span class="stock-badge ' + stockClass + '">' + stockText + '</span>';
      }
      html += '    <button class="btn-reserve" onclick="abrirModal(' + p.id + ')"';
      if (p.restante === 0) html += ' disabled';
      html += '>Selecionar presente</button>';
      html += '  </div>';
      html += '</div>';
    });

    html += '</div>';
  }

  container.innerHTML = html;
}

function abrirModal(presenteId) {
  presenteSelecionado = todosPresentes.find(function (p) { return p.id === presenteId; });
  if (!presenteSelecionado) return;

  document.getElementById('modalItemName').textContent = presenteSelecionado.item;
  if (config.mostrarQuantidadeRestante !== false) {
    document.getElementById('modalItemStock').textContent =
      presenteSelecionado.restante + ' disponível' + (presenteSelecionado.restante !== 1 ? 's' : '');
    document.getElementById('modalItemStock').style.display = 'block';
  } else {
    document.getElementById('modalItemStock').style.display = 'none';
  }
  document.getElementById('inputNome').value = '';
  document.getElementById('inputEmail').value = '';
  document.getElementById('inputQuantidade').value = '1';
  document.getElementById('modalOverlay').classList.add('active');
}

function fecharModal() {
  document.getElementById('modalOverlay').classList.remove('active');
  presenteSelecionado = null;
}

async function confirmarReserva() {
  const nome = document.getElementById('inputNome').value.trim();
  const email = document.getElementById('inputEmail').value.trim();
  const quantidade = parseInt(document.getElementById('inputQuantidade').value, 10);

  if (!nome) {
    showToast('Por favor, informe seu nome.', 'error');
    return;
  }

  if (isNaN(quantidade) || quantidade <= 0) {
    showToast('Quantidade deve ser maior que zero.', 'error');
    return;
  }

  const btnConfirm = document.querySelector('.btn-confirm');
  const btnCancel = document.querySelector('.btn-cancel');
  btnConfirm.disabled = true;
  btnConfirm.textContent = 'Confirmando...';
  btnCancel.disabled = true;

  try {
    const result = await apiReservarPresente({
      nome: nome,
      email: email,
      presenteId: presenteSelecionado.id,
      quantidade: quantidade,
      tipo: document.querySelector('input[name="tipo"]:checked').value
    });

    btnConfirm.disabled = false;
    btnConfirm.textContent = 'Confirmar';
    btnCancel.disabled = false;

    if (result.success) {
      const msg = (config.mensagemConfirmacao || 'Reserva confirmada!')
        .replace('{nome}', nome);
      showToast(msg, 'success');
      fecharModal();
      const presentes = await apiListarPresentes();
      todosPresentes = presentes;
      renderizarPresentes(presentes);
    } else {
      showToast(result.message, 'error');
    }
  } catch (error) {
    btnConfirm.disabled = false;
    btnConfirm.textContent = 'Confirmar';
    btnCancel.disabled = false;
    showToast('Erro ao processar reserva. Tente novamente.', 'error');
  }
}

function showToast(message, type) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = 'toast ' + type + ' show';
  setTimeout(function () {
    toast.className = 'toast';
  }, 3000);
}

document.addEventListener('DOMContentLoaded', init);
