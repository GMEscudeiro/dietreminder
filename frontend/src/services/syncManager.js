import api from './api';

const FILA_KEY = '@DietReminder:filaSync';

export const SyncManager = {
  adicionarNaFila: (metodo, url, dados) => {
    const fila = JSON.parse(localStorage.getItem(FILA_KEY) || '[]');
    fila.push({ id: Date.now().toString(), metodo, url, dados });
    localStorage.setItem(FILA_KEY, JSON.stringify(fila));
  },

  sincronizar: async () => {
    if (!navigator.onLine) return;

    const fila = JSON.parse(localStorage.getItem(FILA_KEY) || '[]');
    if (fila.length === 0) return;

    console.log(`[Sync] Sincronizando ${fila.length} ações pendentes...`);
    const filaRestante = [];

    for (const acao of fila) {
      try {
        if (acao.metodo === 'post') await api.post(acao.url, acao.dados);
        if (acao.metodo === 'patch') await api.patch(acao.url, acao.dados);
        console.log(`[Sync] Sucesso: ${acao.metodo.toUpperCase()} ${acao.url}`);
      } catch (error) {
        if (!error.response) {
          filaRestante.push(acao);
        } else {
          console.error(`[Sync] Erro do servidor descartado:`, error.response.data);
        }
      }
    }

    localStorage.setItem(FILA_KEY, JSON.stringify(filaRestante));
  }
};
