import { axiosInstance } from './lib/axios';
import { TaskInfoValues } from '../hooks/useTask';

// 업무 생성
export const createTask = async (taskData: object) => {
  try {
    const response = await axiosInstance.post('/api/tasks', taskData, {
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

// 업무 상세정보 조회
export const fetchTaskInfo = async (tid: string) => {
  try {
    const response = await axiosInstance.get(`/api/tasks/${tid}/info`,{
    });
    return response.data;
  } catch (error) {
    console.log(error)
    return {};
  }
};

// 업무 상세정보 수정
export const updateTask = async (tid: string, updatedData: Partial<TaskInfoValues>) => {
  try{
    const response = await axiosInstance.patch(`/api/tasks/${tid}/info`, updatedData);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

// 업무 담당자 추가
export const addTaskManager = async (tid: string, managerId: string, projectId: string) => {
  const { data } = await axiosInstance.post(`/api/tasks/${tid}/managers`, {
    managerId,
    projectId,
  });
  return data;
};