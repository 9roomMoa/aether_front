import { axiosInstance } from './lib/axios';

// 공지 조회
export const fetchNotices = async () => {
  const response = await axiosInstance.get('/notices');
  return response.data.result.notices ?? [];
};

// export const fetchNotices = async () => {
//   try {
//     const response = await axiosInstance.get("/notices");
//     console.log("공지 API 응답 원본:", response.data);
//     const raw = response.data.result?.notices ?? [];

//     return raw.map((n: any) => ({
//       id: n._id,
//       content: n.content,
//       createdAt: n.createdAt,
//     }));
//   } catch (error) {
//     console.error("공지 API 실패:", error);
//     throw error;
//   }
// };

// 공지 생성
export const createNotice = async (content : string) => {
  const response = await axiosInstance.post('/notices', { content });
  return response.data;
};
