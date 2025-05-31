import { axiosInstance } from './lib/axios';
// import { ProjectIinfoValues } from '../hooks/useProject';

// 프로젝트 생성
export const createProject = async (projectData: object) => {
  try {
    const response = await axiosInstance.post('/api/projects', projectData, {
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
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

// 프로젝트 상세 조회
export const fetchProject = async (pid: string) => {
  try {
    const response = await axiosInstance.get(`/api/projects/${pid}/info`,{
    });
    return response.data;
  } catch (error) {
    console.log(error)
  }
};

// 프로젝트 수정
export const updateProject = async (pid: string, updatedData: Partial<ProjectIinfoValues>) => {
  try{
    const response = await axiosInstance.patch(`/api/projects/${pid}`, updatedData);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
