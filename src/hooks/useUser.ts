import { useQuery } from "@tanstack/react-query";
import { fetchProjectMembers, fetchUserInfo, fetchMembers, searchProjectMembers  } from "../api/userApi"; 
import { useState, useEffect } from "react";
export interface User {
  _id: string;
  name: string;
  email: string;
  rank: string;
  role: string;
}

// 전체 멤버 목록 검색
export const useAllMembers = (keyword: string = "") => {
  return useQuery<User[]>({
    queryKey: ["allMembers", keyword],
    queryFn: () => fetchMembers(keyword),
    enabled: keyword.trim().length > 0, // 검색어가 있을 때만 호출
  });
};

// 프로젝트 멤버 조회
export const useProjectMembers = (projectId: string) => {
  return useQuery<{
    creator: User;
    members: User[];
  }>({
    queryKey: ["projectMembers", projectId],
    queryFn: () => fetchProjectMembers(projectId),
    enabled: !!projectId,
  });
};

// 프로젝트에 속한 멤버 검색
export const usesearchProjectMembers = (projectId: string, keyword: string = "") => {
  return useQuery<User[]>({
    queryKey: ["projectMembers", projectId, keyword],
    queryFn: () => searchProjectMembers(projectId, keyword),
    enabled: !!projectId,
  });
};  

// 로그인한 사용자 정보
export const useCurrentUser = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const userInfo = await fetchUserInfo();
      setUser(userInfo);
    };
    getUser();
  }, []);

  return user;
};