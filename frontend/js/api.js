// api.js - Camada de comunicação com Apps Script

const API_URL = 'https://script.google.com/macros/s/AKfycbwwZCTkXj9dU90EcuuLWsIZadKaFTCvkAzMknWsoMgC2ECIA6UNFcvJi3ZqMp15r_qS/exec';

async function apiRequest(action, params = {}) {
  try {
    const url = new URL(API_URL);
    url.searchParams.set('action', action);
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }

    const response = await fetch(url.toString());
    if (!response.ok) throw new Error('Erro na requisição');

    return await response.json();
  } catch (error) {
    console.error('Erro na API:', error);
    throw error;
  }
}

async function apiPostRequest(data) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'text/plain'
      }
    });
    if (!response.ok) throw new Error('Erro na requisição');

    return await response.json();
  } catch (error) {
    console.error('Erro na API:', error);
    throw error;
  }
}

async function apiListarPresentes() {
  return apiRequest('listar');
}

async function apiPesquisarPresentes(termo) {
  return apiRequest('pesquisar', { q: termo });
}

async function apiObterConfig() {
  return apiRequest('config');
}

async function apiObterEstatisticas() {
  return apiRequest('estatisticas');
}

async function apiReservarPresente(dados) {
  return apiPostRequest({ action: 'reservar', ...dados });
}

async function apiCancelarReserva(id) {
  return apiPostRequest({ action: 'cancelar', id });
}
