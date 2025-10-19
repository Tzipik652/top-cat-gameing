import axios, { AxiosInstance } from 'axios';

export interface User {
  id: number;
  name: string;
  image_url: string;
  score: number;
}

export interface UserRankResponse {
  rank: number;
  user: User;
  neighbors: User[];
}

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';

class UsersService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: { 'Content-Type': 'application/json' },
    });

    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        const message = error.response?.data?.error || error.message || 'error server';
        console.error('API Error:', message);
        return Promise.reject(new Error(message));
      }
    );
  }

  async addUser(name: string, image_url: string, score: number = 0) {
    const { data } = await this.api.post('/users', { name, image_url, score });
    return data;
  }

  async updateScore(userId: number, score: number) {
    const { data } = await this.api.put(`/users/${userId}/score`, { score });
    return data;
  }

  async getTopUsers(top: number = 10): Promise<User[]> {
    const { data } = await this.api.get('/users/leaderboard', { params: { top } });
    return data;
  }

  async getLowestUsers(limit: number = 2): Promise<User[]> {
    const { data } = await this.api.get('/users/leaderboard/lowest', { params: { limit } });
    return data;
  }

  async getUserRank(userId: number): Promise<UserRankResponse> {
    const { data } = await this.api.get(`/users/${userId}/rank`);
    return data;
  }
}

export default new UsersService();