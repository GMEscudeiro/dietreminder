import api from './api';

export const getRefeicoes = async () => {
  const { data } = await api.get('/refeicoes');
  return data;
};

export const checkRefeicao = async (id: string, concluida: boolean) => {
  return api.patch(`/refeicoes/${id}/status`, { concluida });
};

export const deleteRefeicao = async (id: string) => {
  return api.delete(`/refeicoes/${id}`);
};
