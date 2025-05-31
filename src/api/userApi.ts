import { axiosInstance } from "./lib/axios"; 
import { User } from "../hooks/useUser";

// 프로젝트 멤버 정보 fetch
export const fetchProjectMembers = async (pid: string, keyword: string = ""): Promise<User[]> => {
  const { data } = await axiosInstance.get(`/api/projects/${pid}/members`, {
    params: keyword ? { keyword } : {},
  });
  return data?.data?.members || [];
};

// // 유저 정보 가져오기
export const fetchUserInfo = async (): Promise<User> => {
  const _id = localStorage.getItem("userId") || "";
  const email = localStorage.getItem("email") || "";
  const name = localStorage.getItem("username") || "";
  const role = "Member"; // 기본값 또는 백엔드에서 받아올 수 있으면 교체
  const rank = localStorage.getItem("rank") || "";

  return { _id, email, name, role, rank };
};
