import { axiosInstance } from './lib/axios';

// 공지 조회
export const fetchNotices = async () => {
  const response = await axiosInstance.get('/notices');
  return response.data.result.notices ?? [];
};

// 공지 생성
export const createNotice = async (content : string) => {
  const response = await axiosInstance.post('/notices', { content });
  return response.data;
};
