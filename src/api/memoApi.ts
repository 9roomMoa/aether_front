import { axiosInstance } from './lib/axios';

// 메모 생성
export const createMemo = async (description: string) => {
  try {
    const response = await axiosInstance.post('/api/memo', {description}, {
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

// 메모 조회
export const fetchMemo = async () => {
  try {
    const response = await axiosInstance.get(`/api/memo`,{
    });
    return response.data.data ?? [];
  } catch (error) {
    console.log(error)
    return [];
  }
};

