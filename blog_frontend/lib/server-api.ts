import axios from 'axios';
import { cookies } from 'next/headers';

export async function getServerApi() {
  const token = (await cookies()).get('token')?.value;

  const serverApi = axios.create({
    baseURL: 'http://localhost:8000/api/',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  return serverApi;
}
