import { axiosInstance } from './lib/axios';
import { ProjectIinfoValues } from '../hooks/useProject';

// 프로젝트 생성
export const createProject = async (projectData: object) => {
  try {
    const response = await axiosInstance.post('/api/projects', projectData, {
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// 프로젝트 리스트 조회
export const fetchProjectList = async (teamId: string) => {
  try {
    const response = await axiosInstance.get(`/api/projects/${teamId}`,{
    });
    return response.data;
  } catch (error) {
    console.log(error)
    return [];
  }
};

// 업무 상세정보 수정
// export const updateTask = async (tid: string, updatedData: Partial<TaskInfoValues>) => {
//   try{
//     const response = await axiosInstance.patch(`/api/tasks/${tid}/info`, updatedData);
//     return response.data;
//   } catch (error) {
//     console.log(error);
//   }
// };
