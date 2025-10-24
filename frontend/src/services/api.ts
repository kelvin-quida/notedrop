import axios from 'axios';
import type { Message, CreateMessageRequest } from '../types/message';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const messageService = {
  async getMessages(): Promise<Message[]> {
    const response = await api.get('/api/messages/');
    return response.data;
  },

  async createMessage(data: CreateMessageRequest): Promise<Message> {
    const response = await api.post('/api/messages/', data);
    return response.data;
  },

  async exportMessages(): Promise<Blob> {
    const response = await api.get('/api/messages/export.xlsx', {
      responseType: 'blob',
    });
    return response.data;
  },

  async deleteAllMessages(): Promise<{ message: string }> {
    const response = await api.delete('/api/messages/');
    return response.data;
  },

  async updateMessage(id: number, data: CreateMessageRequest): Promise<Message> {
    const response = await api.patch(`/api/messages/${id}/`, data);
    return response.data;
  },

  async deleteMessage(id: number): Promise<{ message: string }> {
    const response = await api.delete(`/api/messages/${id}/delete/`);
    return response.data;
  },
};



