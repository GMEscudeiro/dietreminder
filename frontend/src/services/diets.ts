import api from './api';

export const DietsService = {
  async getActive() {
    const response = await api.get('/diets/active');
    return response.data;
  },
  
  async listAll() {
    const response = await api.get('/diets');
    return response.data;
  },
  
  async create(data: any) {
    const response = await api.post('/diets', data);
    return response.data;
  },
  
  async update(id: string, data: any) {
    const response = await api.patch(`/diets/${id}`, data);
    return response.data;
  }
};
